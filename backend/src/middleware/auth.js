import jwt from "jsonwebtoken";

const handleAuthorization = async (req, res, next) => {
  try {
    let token;
    if (req?.headers?.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decode.id);

      next();
    }

    if (!token) {
      res.status(401);
      throw new Error("User is unauthorized! Please check your credentials!!");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const checkIsAdmin = async (req, res, next) => {
  const { role } = req.user.role;
  if (role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
};

const checkIsProjectManager = async (req, res, next) => {
  const { role } = req.user.role;
  if (role !== "project_manager") {
    return res
      .status(403)
      .json({ message: "Access denied: Project Manager only" });
  }
  next();
};

const checkIsMember = async (req, res, next) => {
  const { role } = req.user.role;
  if (role !== "member") {
    return res.status(403).json({ message: "Access denied: Members only" });
  }
  next();
};
module.exports = {
  handleAuthorization,
  checkIsAdmin,
  checkIsMember,
  checkIsProjectManager,
};
