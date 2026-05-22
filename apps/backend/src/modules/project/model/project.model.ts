import mongoose, {
  Schema,
  Document,
  type ObjectId,
  type HydratedDocument,
} from "mongoose";
import { string } from "zod";

export interface IProject {
  // _id: Types.ObjectId;
  name: string;
  userId: ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
  messages?: ObjectId[];
  projectUrl?: string | null;
}

type ProjectDocument = HydratedDocument<IProject>;

const ProjectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
      unique: true, // creates unique index
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      default: "69ea5d364274bf270930857a",
      required: true,
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    projectUrl: {
      type: String,
      default: null,
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

ProjectSchema.pre("save", function () {
  this.updatedAt = new Date();
});

export const ProjectModel = mongoose.model<IProject>("Project", ProjectSchema);
