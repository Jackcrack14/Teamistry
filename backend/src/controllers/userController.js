import User from "../models/userModel";
import Organization from "../models/organizationModel";
import bcrypt from "bcryptjs";
import generateToken from "../config/token";

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
    const salt = bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hash(password, salt);
    let organization = Organization.findOne({ organizationName }, "_id");
    let role = "member";
    if (!organization) {
      const newOrganization = await new Organization({
        name: organizationName,
      });

      newOrganization.save().then((item) => {
        organization = item._id;
      });
      role = "admin";
    }

    const user = new User({
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
  } catch (error) {
    console.log(error.message);
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
  }
};

const editUser = async (req, res) => {
  try {
    const { id } = req.body;

    const user = User.findOne({ _id: id });

    if (!user) {
      res.status(400);
      throw new Error("Unknown user! Please check your account!!");
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { registerUser, handleLogin, editUser };
