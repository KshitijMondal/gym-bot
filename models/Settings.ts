import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true }, // The vault lock
    gymName: { type: String, default: "" },
    contactNumber: { type: String, default: "" },
    supportEmail: { type: String, default: "" },
    enableWhatsAppBot: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Prevent ghost schema caching
export default mongoose.models.Settings || mongoose.model("Settings", settingsSchema);