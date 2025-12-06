import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized access." });
    }
    const decoded = jwt.verify(token, process.env.jwtSecretKey);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Unauthorized access." });
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized access." });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized access." });
  }
};
