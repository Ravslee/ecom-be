const jwt = require("jsonwebtoken");
const { secret } = require("../config/jwt");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ message: "No token provided" });
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, secret);
    const user = await User.findById(payload.sub).select("-passwordHash");
    if (!user) return res.status(401).json({ message: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid token" });
  }
};

exports.requireRole = (role) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  if (req.user.role !== role)
    return res.status(403).json({ message: "Forbidden" });
  next();
};
