const Pricing = require("../models/pricing.js");

exports.getPricing = async (req, res) => {
  try {
    const priceRates = await Pricing.find();
    res.status(200).json(priceRates);
  } catch (err) {
    console.error("Fetch pricing error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.updatePricing = async (req, res) => {
  try {
    const { _id, ...newPriceRates } = req.body;

    if (!newPriceRates || !_id) {
      return res.status(400).json({ message: "Missing pricing data" });
    }

    const updated = await Pricing.findByIdAndUpdate(_id, newPriceRates, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Pricing record not found" });
    }

    res.status(200).json({ message: "Price Updated Successfully" });
  } catch (err) {
    console.error("Update pricing error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
