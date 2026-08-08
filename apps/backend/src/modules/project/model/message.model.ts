import mongoose, { Schema, Document, type ObjectId } from "mongoose";
import type { IExecutionLog, IToolCall } from "../types/project.types.js";

const ToolCallSchema = new Schema<IToolCall>(
  {
    tool: String,

    filesEffected: {
      type: [String],
      default: [],
    },

    success: Boolean,

    summary: String,
  },
  {
    _id: false,
  },
);

const ExecutionLogSchema = new Schema<IExecutionLog>(
  {
    initialPrompt: {
      type: String,
      default: "",
    },

    finalResponse: {
      type: String,
      default: "",
    },

    toolCalls: {
      type: [ToolCallSchema],
      default: [],
    },
  },
  {
    _id: false,
  },
);

export interface IMessage extends Document {
  // projectId: ObjectId;
  content: string;
  role: "user" | "agent";
  createdAt: Date;
  executionLog?: IExecutionLog;
  error?: boolean;
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
    executionLog: {
      type: ExecutionLogSchema,
      default: undefined,
    },
    error: {
      type: Boolean,
      default: false,
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
