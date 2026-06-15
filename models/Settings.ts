import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // The user who created the settings
    orgId: { type: String, required: false, index: true }, // V2.0: The isolated Gym Branch
    gymName: { type: String, default: "" },
    contactNumber: { type: String, default: "" },
    supportEmail: { type: String, default: "" },
    enableWhatsAppBot: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// V2.0 Critical Fix: We must remove 'unique: true' from userId.
// Because one User can now own multiple Organizations (Downtown and Northside),
// they will have multiple settings documents in the database.
// To ensure a branch only has one settings file, we create a compound unique index instead.
settingsSchema.index({ userId: 1, orgId: 1 }, { unique: true });

// Prevent ghost schema caching
export default mongoose.models.Settings || mongoose.model("Settings", settingsSchema);