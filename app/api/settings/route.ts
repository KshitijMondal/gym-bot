import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";

// Ensure DB connection (adjust this line if you have a specific db config file like '@/lib/mongodb')
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
};

import Settings from "@/models/Settings";

// GET: Fetch the current user's settings
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    await connectDB();
    const settings = await Settings.findOne({ userId });
    return NextResponse.json(settings || {});
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// POST: Save or Update the settings
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    await connectDB();

    // Upsert: If settings exist, update them. If not, create them.
    const settings = await Settings.findOneAndUpdate(
      { userId },
      { ...body, userId },
      { new: true, upsert: true }
    );

    return NextResponse.json(settings);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}