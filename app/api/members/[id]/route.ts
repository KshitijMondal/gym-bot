import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Member from "@/models/Member";

export async function DELETE(
  request: Request,
  // 1. Define params as a Promise
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    await dbConnect();
    
    // 2. Await the params before using them
    const { id } = await params; 

    const deleted = await Member.findByIdAndDelete(id).lean();
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
    await dbConnect();
    
    // 2. Await the params before using them
    const { id } = await params;
    const body = await request.json();

    const updated = await Member.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

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