import mongoose from "mongoose";

const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    comment: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  },
  {
    timestamps: true,
  }
);

commentSchema.index({ author: 1 });
commentSchema.index({ task: 1 });

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
