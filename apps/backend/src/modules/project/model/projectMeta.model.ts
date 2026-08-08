import mongoose, { Schema, Document, type Types } from "mongoose";

export interface IProjectMeta {
  projectId: Types.ObjectId;
  goal: string;
  state: string;
  completed: string[];
  pending: string[];
  architecture: string[];
  preferences: string[];
  issues: string[];
  importantFiles: string[];
  lastTask: string;
  createdAt: Date;
  updatedAt: Date;
}

const projectMetaSchema = new Schema<IProjectMeta>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Project",
      index: true,
    },
    goal: {
      type: String,
    },

    state: {
      type: String,
    },

    completed: [
      {
        type: String,
      },
    ],

    pending: [
      {
        type: String,
      },
    ],

    architecture: [
      {
        type: String,
      },
    ],

    preferences: [
      {
        type: String,
      },
    ],

    issues: [
      {
        type: String,
      },
    ],

    importantFiles: [
      {
        type: String,
      },
    ],

    lastTask: {
      type: String,
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

projectMetaSchema.pre("save", function () {
  this.updatedAt = new Date();
});

export const ProjectMetaModel = mongoose.model<IProjectMeta>(
  "project-meta",
  projectMetaSchema,
);
