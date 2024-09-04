import Project from "../models/projectModel";
import Comment from "../models/commentModel";

const addComment = async (req, res) => {
  const { comment, taskId } = req.body;
  const { _id } = req.user;

  const task = await Task.findById(taskId);

  if (!task) {
    return res.status(404).json({ error: "There is no such task" });
  }

  const newComment = await new Comment({
    comment: comment,
    author: _id,
    task: taskId,
  });

  await newComment.save();

  return res.status(201).json(newComment);
};

const deleteComment = async (req, res) => {
  const id = req.params;
  const { _id, role } = req.user;

  const comment = await Comment.findById(id);

  if (!comment) {
    return res
      .status(404)
      .json({ error: "There is no such comment to delete" });
  }
  if (
    _id.toString() !== comment.author.toString() &&
    role !== "project_manager" &&
    role !== "admin"
  ) {
    res
      .status(403)
      .jsons({ error: "You are not authorized to delete the comment" });
  }
};
