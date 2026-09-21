const Address = require("../models/Address");
const UserAddress = require("../models/UserAddress");

exports.listAddresses = async (req, res, next) => {
  try {
    const userAddresses = await UserAddress.find({ user: req.user._id })
      .populate("address")
      .sort("-is_default -createdAt");
    res.json(userAddresses);
  } catch (err) {
    next(err);
  }
};

exports.createAddress = async (req, res, next) => {
  try {
    const {
      unit_number,
      street_number,
      address_line1,
      address_line2,
      city,
      region,
      postal_code,
      country,
      is_default = false,
    } = req.body;

    if (!address_line1 || !city || !postal_code) {
      return res
        .status(400)
        .json({ message: "address_line1, city, and postal_code are required" });
    }

    const newAddress = await Address.create({
      unit_number,
      street_number,
      address_line1,
      address_line2,
      city,
      region,
      postal_code,
      country,
    });

    if (is_default) {
      await UserAddress.updateMany(
        { user: req.user._id },
        { is_default: false }
      );
    }

    // If this is the user's first address, make it default automatically
    const existingCount = await UserAddress.countDocuments({ user: req.user._id });
    const shouldBeDefault = is_default || existingCount === 0;

    const userAddr = await UserAddress.create({
      user: req.user._id,
      address: newAddress._id,
      is_default: shouldBeDefault,
    });

    const populated = await UserAddress.findById(userAddr._id).populate("address");
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

exports.updateAddress = async (req, res, next) => {
  try {
    const { id } = req.params; // UserAddress ID
    const {
      unit_number,
      street_number,
      address_line1,
      address_line2,
      city,
      region,
      postal_code,
      country,
      is_default,
    } = req.body;

    const userAddr = await UserAddress.findOne({ _id: id, user: req.user._id });
    if (!userAddr) return res.status(404).json({ message: "Address not found" });

    await Address.findByIdAndUpdate(userAddr.address, {
      unit_number,
      street_number,
      address_line1,
      address_line2,
      city,
      region,
      postal_code,
      country,
    });

    if (is_default === true) {
      await UserAddress.updateMany(
        { user: req.user._id },
        { is_default: false }
      );
      userAddr.is_default = true;
      await userAddr.save();
    }

    const updated = await UserAddress.findById(userAddr._id).populate("address");
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params; // UserAddress ID
    const userAddr = await UserAddress.findOne({ _id: id, user: req.user._id });
    if (!userAddr) return res.status(404).json({ message: "Address not found" });

    const addressId = userAddr.address;
    await UserAddress.findByIdAndDelete(userAddr._id);
    await Address.findByIdAndDelete(addressId);

    // If deleted address was default, make another one default if exists
    if (userAddr.is_default) {
      const remaining = await UserAddress.findOne({ user: req.user._id });
      if (remaining) {
        remaining.is_default = true;
        await remaining.save();
      }
    }

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

exports.setDefault = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userAddr = await UserAddress.findOne({ _id: id, user: req.user._id });
    if (!userAddr) return res.status(404).json({ message: "Address not found" });

    await UserAddress.updateMany(
      { user: req.user._id },
      { is_default: false }
    );
    userAddr.is_default = true;
    await userAddr.save();

    const populated = await UserAddress.findById(userAddr._id).populate("address");
    res.json(populated);
  } catch (err) {
    next(err);
  }
};
