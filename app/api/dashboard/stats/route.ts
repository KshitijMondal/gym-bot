import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";

// Ensure DB connection
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
};

import Member from "@/models/Member";

export async function GET() {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await connectDB();

    // V2.0 Multi-Tenant Context Routing
    const query = orgId ? { orgId } : { userId, orgId: null };

    // 1. Calculate Total Members
    const totalMembers = await Member.countDocuments(query);

    // 2. Calculate Active Members
    const activeMembers = await Member.countDocuments({
      ...query,
      status: "Active",
    });

    // 3. Fetch active member plans to compute revenue with exact business pricing tiers
    const activeMembersList = await Member.find({ ...query, status: "Active" })
      .select("plan")
      .lean();
    
    // V2.0 Enterprise Correction: Mirroring your exact pricing schema mapping
    const monthlyRevenue = activeMembersList.reduce((sum, member) => {
      const planType = member.plan || "Monthly";
      
      if (planType === "Monthly") return sum + 1500;
      if (planType === "Quarterly") return sum + 4000;
      if (planType === "Annual") return sum + 12000;
      
      return sum + 1500; // Fallback safe guard
    }, 0);

    // 4. Fetch the 5 Most Recent Members for the Activity Feed
    const recentActivity = await Member.find(query)
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return NextResponse.json({
      totalMembers,
      activeMembers,
      monthlyRevenue,
      recentActivity,
    }, { status: 200 });

  } catch (err) {
    console.error("GET /api/dashboard/stats error:", err);
    return NextResponse.json(
      { error: "Failed to load dashboard metrics." },
      { status: 500 }
    );
  }
}