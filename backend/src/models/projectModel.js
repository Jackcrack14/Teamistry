import mongoose from "mongoose";

const { Schema } = mongoose;

const projectSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
  status: {
    type: String,
    enum: ["active", "completed", "on hold", "archived"],
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  visibility: {
    type: String,
    enum: ["private", "public"],
    default: "private",
  },
  attachments: [
    {
      filename: { type: String },
      url: { type: String },
    },
  ],
  activityLog: [
    {
      action: String,
      timestamp: { type: Date, default: Date.now },
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
  settings: {
    notifications: {
      type: Boolean,
      default: true,
    },
    customFields: Schema.Types.Mixed,
  },
  milestones: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Milestone",
    },
  ],
  budget: {
    type: Number,
    default: 0,
  },
  currency: {
    type: String,
    default: "USD",
  },
});

projectSchema.index({ owner: 1 });

projectSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
