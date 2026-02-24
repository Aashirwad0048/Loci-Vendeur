import jwt from "jsonwebtoken";
import env from "../config/env.js";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.id).select("_id role status");

    if (!user || user.status !== "active") {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    req.user = {
      id: user._id,
      role: user.role,
      status: user.status,
    };

    next();
  } catch (_error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export const optionalProtect = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.id).select("_id role status");

    if (!user || user.status !== "active") {
      return next();
    }

    req.user = {
      id: user._id,
      role: user.role,
      status: user.status,
    };
    return next();
  } catch (_error) {
    return next();
  }
};
