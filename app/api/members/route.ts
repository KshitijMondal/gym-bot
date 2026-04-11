import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/mongodb";
import Member from "@/models/Member";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await dbConnect();
    // .lean() strips heavy Mongoose features for faster data transfer
    const members = await Member.find({ userId }).sort({ createdAt: -1 }).lean();
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
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();

    const name = body.name?.trim();
    const countryCode = body.countryCode?.trim() || "+91";
    const phone = body.phone?.trim();
    const plan = body.plan?.trim();

    if (!name || !phone || !plan) {
      return NextResponse.json(
        { error: "Name, phone, and plan are required." },
        { status: 400 }
      );
    }

    const created = await Member.create({
      userId,
      name,
      countryCode,
      phone,
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