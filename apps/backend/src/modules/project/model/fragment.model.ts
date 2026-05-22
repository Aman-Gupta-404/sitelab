import mongoose, {
  Schema,
  Document,
  type ObjectId,
  type Mixed,
} from "mongoose";

export interface IFragment extends Document {
  messageId: ObjectId;
  sandboxUrl: string;
  title: string;
  files: Mixed;
  createdAt: Date;
  updatedAt: Date;
}

const FragmentSchema = new Schema<IFragment>(
  {
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    sandboxUrl: {
      type: String,
      default: "user",
    },
    title: {
      type: String,
      default: "user",
    },
    files: {
      type: mongoose.Schema.Types.Mixed, // equivalent to Prisma Json
      required: true,
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

FragmentSchema.pre("save", function () {
  this.updatedAt = new Date();
});

export const FragmentModel = mongoose.model<IFragment>(
  "Fragment",
  FragmentSchema,
);
