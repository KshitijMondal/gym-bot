import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import mongoose from "mongoose";

import Member from "@/models/Member";
import Settings from "@/models/Settings";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add WEBHOOK_SECRET from Clerk Dashboard to .env");
  }

  // Get the headers
  // Get the headers directly from the incoming Request object
  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");
  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", { status: 400 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", { status: 400 });
  }

  const eventType = evt.type;

  // 1. If an Organization (Gym) is deleted, wipe all their members and settings
  if (eventType === "organization.deleted") {
    const { id } = evt.data;
    if (id) {
      if (mongoose.connection.readyState < 1) {
        await mongoose.connect(process.env.MONGODB_URI as string);
      }
      await Member.deleteMany({ orgId: id });
      await Settings.deleteMany({ orgId: id });
      console.log(`🧹 Wiped all database records for deleted organization: ${id}`);
    }
  }

  // 2. If a User is deleted, wipe any personal settings they might have had
  if (eventType === "user.deleted") {
    const { id } = evt.data;
    if (id) {
      if (mongoose.connection.readyState < 1) {
        await mongoose.connect(process.env.MONGODB_URI as string);
      }
      await Settings.deleteMany({ userId: id, orgId: null });
      console.log(`🧹 Wiped personal records for deleted user: ${id}`);
    }
  }

  return new Response("Webhook processed successfully", { status: 200 });
}