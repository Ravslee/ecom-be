const VariationOption = require("../models/VariationOption");

// Create
exports.create = async (req, res) => {
  try {
    const variationOption = await VariationOption.create(req.body);
    res.status(201).json(variationOption);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Read all
exports.findAll = async (req, res) => {
  try {
    const variationOptions = await VariationOption.findAll();
    res.status(200).json(variationOptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read by variation ID
exports.findAllByVariationId = async (req, res) => {
  try {
    const variationOptions = await VariationOption.findAll({
      where: { variation: req.params.variationId },
    });
    res.status(200).json(variationOptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read by ID
exports.findById = async (req, res) => {
  try {
    const variationOption = await VariationOption.findByPk(req.params.id);
    if (!variationOption) {
      return res.status(404).json({ error: "Not found" });
    }
    res.status(200).json(variationOption);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update
exports.update = async (req, res) => {
  try {
    const variationOption = await VariationOption.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!variationOption) {
      return res.status(404).json({ error: "Not found" });
    }
    res.status(200).json(variationOption);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete
exports.delete = async (req, res) => {
  try {
    const variationOption = await VariationOption.findByIdAndDelete(
      req.params.id
    );
    if (!variationOption) {
      return res.status(404).json({ error: "Not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete by variation ID
exports.deleteByVariationId = async (req, res) => {
  try {
    const deleted = await VariationOption.deleteMany({
      where: { variation: req.params.variationId },
    });
    if (deleted === 0) {
      return res.status(404).json({ error: "Not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
