import Project from "../models/projectModel";

const addProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const owner = req?.user?.id;
    const organization = req?.user?.organization;
    if (!title) {
      res.status(400);
      throw new Error("Please enter Title of the Project!!");
    }

    if (!owner) {
      res.status(400);
      throw new Error("Unknown user! Please check your account details!!");
    }

    if (!organization) {
      res.status(400);
      throw new Error("You are not in an Orgnization!!");
    }

    const project = await new Project({
      title: title,
      description: description,
      owner: owner,
      organization: organization,
    });

    await project.save();

    if (project) {
      res.status(201).json({
        title: title,
        description: description,
      });
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const organizationId = req.user?.organization;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    if (project.organization.toString() !== organizationId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this project" });
    }

    const result = await Project.deleteOne({ _id: projectId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Project could not be deleted" });
    }

    return res.status(200).json({ message: "Project successfully deleted" });
  } catch (error) {
    // Error logging
    console.error("Error deleting project:", error.message);

    // Respond with an error status and message
    return res
      .status(500)
      .json({ error: "An error occurred while deleting the project" });
  }
};

module.exports = { addProject, deleteProject };
