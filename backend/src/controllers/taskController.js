import Task from "../models/taskModel";
import Project from "../models/projectModel";

const addTask = async (req, res) => {
  try {
    const { title, description, projectId } = req.body;
    const { organization, _id } = req.user;

    const currentProject = await Project.findById(projectId);

    if (!currentProject) {
      return res.status(404).json({ error: "There is no such Project!!" });
    }
    if (currentProject.organization.toString() !== organization.toString()) {
      return res
        .status(403)
        .json({ error: "The user is not part of the organization" });
    }

    const task = await new Task({
      title: title,
      description: description,
      project: projectId,
      assignedTo: _id,
    });
    await task.save();

    res.status(201).json({
      title: title,
      description: description,
    });
  } catch (error) {
    console.error("Error when adding task :::", error.message);
    return res.status(500).json({ error: "Error adding task to the project" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const role = req.user.role;
    const userId = req.user._id;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: "There is no such task!!" });
    }
    if (
      role !== "admin" &&
      role !== "project_manager" &&
      userId.toString() !== task.assignedTo.toString()
    ) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete the task" });
    }
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(500).json({ error: "Unable to delete the task" });
    }
    return res
      .status(200)
      .json({ title: deletedTask.title, description: deletedTask.description });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { addTask, deleteTask };
