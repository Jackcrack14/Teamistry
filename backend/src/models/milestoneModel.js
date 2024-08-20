import mongoose from "mongoose";

const { Schema } = mongoose;
const milestoneSchema = new Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Project",
    },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    status: {
      type: String,
      enum: ["Yet to begin", "In Progress", "Completed"],
      default: "Yet to Begin",
    },
  },
  {
    timestamps: true,
  }
);

milestoneSchema.index({ project: 1, title: 1 });

const Milestone = mongoose.model("Milestone", milestoneSchema);

module.exports = Milestone;
