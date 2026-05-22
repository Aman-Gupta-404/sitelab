import mongoose, { model, Schema, type Types } from "mongoose";

interface IProjectFile extends Document {
  projectId: Types.ObjectId;
  path: string;
  content: string;
  hash: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
}

const projectFileSchema = new Schema<IProjectFile>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Project",
      index: true,
    },

    path: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    hash: {
      type: String,
      required: true,
    },

    size: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

projectFileSchema.index(
  {
    projectId: 1,
    path: 1,
  },
  {
    unique: true,
  },
);

export const ProjectFileModel =
  (mongoose.models.ProjectFile as mongoose.Model<IProjectFile>) ||
  model<IProjectFile>("ProjectFile", projectFileSchema);
// export const ProjectFileModel = model<IProjectFile>(
//   "ProjectFile",
//   projectFileSchema,
// );
