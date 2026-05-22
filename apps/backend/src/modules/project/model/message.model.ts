import mongoose, { Schema, Document, type ObjectId } from "mongoose";

export interface IMessage extends Document {
  // projectId: ObjectId;
  content: string;
  role: "user" | "agent";
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    content: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "agent"],
      default: "user",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

MessageSchema.pre("save", function () {
  this.updatedAt = new Date();
});

export const MessageModel = mongoose.model<IMessage>("Message", MessageSchema);
