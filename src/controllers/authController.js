const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { secret, expiresIn } = require("../config/jwt");

exports.register = async (req, res, next) => {
  try {
    const { email, password, phone_number } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "email and password required" });
    const existing = await User.findOne({ email_address: email });
    if (existing)
      return res.status(409).json({ message: "Email already used" });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email_address: email,
      phone_number,
      passwordHash,
    });
    res.status(201).json({ id: user._id, email: user.email_address });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email_address: email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign({ sub: user._id, role: user.role }, secret, {
      expiresIn,
    });
    res.json({ token });
  } catch (err) {
    next(err);
  }
};
