import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";

// Ensure DB connection
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
};

import Settings from "@/models/Settings";

// GET: Fetch the current branch's settings
export async function GET() {
  try {
    const { userId, orgId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    await connectDB();
    
    const query = orgId ? { orgId } : { userId, orgId: null };
    
    const settings = await Settings.findOne(query);
    return NextResponse.json(settings || {});
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// POST: Save or Update the branch's settings
export async function POST(req: Request) {
  try {
    // V2.0: Extract role alongside IDs
    const { userId, orgId, orgRole } = await auth();
    
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    // V2.0 RBAC: Block non-admins from altering gym settings
    if (orgId && orgRole !== "org:admin") {
      return new NextResponse("Forbidden: Admins Only", { status: 403 });
    }

    const body = await req.json();
    await connectDB();

    const query = orgId ? { orgId } : { userId, orgId: null };

    const settings = await Settings.findOneAndUpdate(
      query,
      { ...body, userId, orgId }, 
      { new: true, upsert: true }
    );

    return NextResponse.json(settings);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
