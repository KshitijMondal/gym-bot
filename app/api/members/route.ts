import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Member from "@/models/Member";

export async function GET() {
  try {
    await dbConnect();
    // .lean() strips heavy Mongoose features for faster data transfer
    const members = await Member.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(members, { status: 200 });
  } catch (err) {
    console.error("GET /api/members error:", err);
    return NextResponse.json(
      { error: "Failed to fetch members." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    const name = body.name?.trim();
    const plan = body.plan?.trim();

    if (!name || !plan) {
      return NextResponse.json(
        { error: "Name and plan are required." },
        { status: 400 }
      );
    }

    const created = await Member.create({
      name,
      plan,
      status: body.status?.trim() || "Active",
      joinDate: body.joinDate?.trim(),
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("POST /api/members error:", err);
    return NextResponse.json(
      { error: "Failed to create member." },
      { status: 500 }
    );
  }
}