import User from "../models/userModel";
import Organization from "../models/organizationModel";
import bcrypt from "bcryptjs";
import generateToken from "../config/token";

const salt = bcrypt.genSalt(10);
const registerUser = async (req, res) => {
  try {
    const { name, email, password, organizationName } = req.body;
    if (!name) {
      res.status(400);
      throw new Error("Please enter user name!!");
    } else if (!email) {
      res.status(400);
      throw new Error("Please enter email!!");
    } else if (!password) {
      res.status(400);
      throw new Error("Please enter your password!!");
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400);
      throw new Error("User already exist! Please login!!");
    }
    const hashedPassword = await bcrypt.hash(password, salt);
    let organization = await Organization.findOne({ organizationName }, "_id");
    let role = "member";
    if (!organization) {
      const newOrganization = await new Organization({
        name: organizationName,
      });

      await newOrganization.save().then((item) => {
        organization = item._id;
      });
      role = "admin";

      const user = await new User({
        name: name,
        email: email,
        password: hashedPassword,
        organization: organization,
        role: role,
      });

      await user.save();

      if (user) {
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          password: user.password,
          token: generateToken(user._id),
        });
      }
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      res.status(400);
      throw new Error("Please enter your email!!");
    } else if (!password) {
      res.status(400);
      throw new Error("Please enter your password!!");
    }

    const user = await User.findOne({ email });
    const validPassword = await bcrypt.compare(password, user.password);

    if (user && validPassword) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        password: user.password,
        token: generateToken(user._id),
      });
    } else if (!user) {
      res.status(401);
      throw new Error("Invalid User! Please check your email!!");
    } else if (!validPassword) {
      res.status(401);
      throw new Error(
        "The password is incorrect! Please check your password!!"
      );
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

const editUser = async (req, res) => {
  try {
    const { id } = req.body;

    const user = await User.findOne({ _id: id });

    if (!user) {
      res.status(400);
      throw new Error("Unknown user! Please check your account!!");
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

const addUser = async (req, res) => {
  try {
    const currentUser = await User.findById(req?.user._id);
    if (!currentUser) {
      res.status(400);
      throw new Error("Invalid User! Please check your credentials");
    } else if (currentUser.role !== "admin") {
      res.status(401);
      throw new Error("Unauthorized User! Please contact Admin!!");
    }
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await new User({
      name,
      email,
      password: hashedPassword,
      role,
      organization: currentUser.organization,
    });
    await newUser.save();
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};
module.exports = { registerUser, handleLogin, editUser, addUser };
