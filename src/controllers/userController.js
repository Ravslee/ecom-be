const User = require("../models/User");

exports.getMe = async (req, res, next) => {
  try {
    const userId = req.user._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // explicitly exclude password (password is select:false, so not required to exclude)
    const user = await User.findById(userId)
      .select("-passwordHash")
      .lean()
      .exec();
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json(user);
  } catch (err) {
    return next(err);
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    const userId = req.user._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // whitelist fields that can be updated from client
    const allowed = ["name", "phone_number"];
    const updates = {};
    allowed.forEach((k) => {
      if (req.body[k] !== undefined) updates[k] = req.body[k];
    });

    const updated = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    })
      .lean()
      .exec();
    if (!updated) return res.status(404).json({ message: "User not found" });

    return res.json(updated);
  } catch (err) {
    return next(err);
  }
};
