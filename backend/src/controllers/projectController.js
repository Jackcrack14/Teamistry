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
    const project = req.body;
    const organizationId = req.user.organization;

    if (project?.organization !== organizationId) {
      res.status(401);
      throw new Error("You are not authorized to delete the project!!");
    }
    const findProject = await Project.findOne({
      title: project.title,
      organization: project.organization,
    });
    if (findProject) {
      const deleteProject = await Project.deleteOne({ _id: findProject?._id });
      console.log("The project deleted is ", deleteProject);
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { addProject, deleteProject };
