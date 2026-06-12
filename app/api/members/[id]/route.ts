import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/mongodb";
import Member from "@/models/Member";

export async function DELETE(
  request: Request,
  // 1. Define params as a Promise
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    // V2.0: Extract orgId alongside userId
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await dbConnect();
    
    // 2. Await the params before using them
    const { id } = await params; 

    // V2.0 B2B Security Routing: Target the specific member within the active Organization
    const query = orgId ? { _id: id, orgId } : { _id: id, userId };

    const deleted = await Member.findOneAndDelete(query).lean();
    if (!deleted) {
      return NextResponse.json({ error: "Member not found." }, { status: 404 });
    }

    return NextResponse.json(deleted, { status: 200 });
  } catch (err) {
    console.error("DELETE /api/members error:", err);
    return NextResponse.json(
      { error: "Failed to delete member." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  // 1. Define params as a Promise
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // V2.0: Extract orgId alongside userId
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await dbConnect();
    
    // 2. Await the params before using them
    const { id } = await params;
    const body = await request.json();
    const phone = body.phone?.trim();
    const countryCode = body.countryCode?.trim() || "+91";

    // V2.0 B2B Security Routing
    const query = orgId ? { _id: id, orgId } : { _id: id, userId };

    const updated = await Member.findOneAndUpdate(
      query,
      {
        ...body,
        phone,
        countryCode,
      },
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: "Member not found." }, { status: 404 });
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("PUT /api/members error:", err);
    return NextResponse.json(
      { error: "Failed to update member." },
      { status: 500 }
    );
  }
}