import mongoose, { type Model, type Schema } from "mongoose";

export type MemberStatus = "Active" | "Expired" | "Pending" | string;

export type MemberDocument = mongoose.Document & {
  userId: string;
  name: string;
  countryCode: string;
  phone: string;
  plan: string;
  status: MemberStatus;
  joinDate: string;
};

function formatJoinDate(d: Date): string {
  // "MMM DD, YYYY" e.g. "Apr 09, 2026"
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(d);
}

const MemberSchema: Schema<MemberDocument> = new mongoose.Schema<MemberDocument>(
  {
    userId: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    countryCode: { type: String, default: "+91", trim: true },
    phone: { type: String, required: true, trim: true },
    plan: { type: String, required: true, trim: true },
    status: { type: String, default: "Active", trim: true },
    joinDate: { type: String, default: () => formatJoinDate(new Date()) },
  },
  { timestamps: true }
);

export const Member: Model<MemberDocument> =
  (mongoose.models.Member as Model<MemberDocument>) ||
  mongoose.model<MemberDocument>("Member", MemberSchema);

export default Member;
