import mongoose from "mongoose";

const emailSchema = new mongoose.Schema(
  {
    recipient: {
      type: String,
      required: true,
    },

    recipientName: {
      type: String,
      required: true,
    },

    topic: {
      type: String,
      required: true,
    },

    tone: {
      type: String,
      default: "professional",
    },

    subject: {
      type: String,
      required: true,
    },

    body: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["draft", "approved"],
      default: "draft",
    },
  },
  { timestamps: true }
);

const Email = mongoose.model("Email", emailSchema);

export default Email;