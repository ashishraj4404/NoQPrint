const User = require("../models/user.js");

exports.createUser = async (req, res) => {
  try {
    const userData = req.body;

    const newUser = new User(userData);
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUserByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ role: user.role });
  } catch (err) {
    console.error("Get user by email error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateUserCoins = async (req, res) => {
  try {
    const { userId, amount } = req.body;
    if (!userId || typeof amount !== "number") {
      return res.status(400).json({ message: "Invalid userId or amount" });
    }

    const user = await User.findOne({ clerkUserId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newBalance = user.coins + amount;
    if (newBalance < 0) {
      return res.status(400).json({ message: "Insufficient coin balance" });
    }

    user.coins = newBalance;
    await user.save();

    res.status(200).json({
      message: `Coins ${amount >= 0 ? "added" : "deducted"} successfully`,
      newBalance: user.coins,
    });
  } catch (err) {
    console.error("Error updating coins:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUserCoins = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }

    const dbUser = await User.findOne({ clerkUserId: userId });

    if (!dbUser) {
      return res.status(404).json({ message: "User not found in DataBase" });
    }

    res.status(200).json(dbUser.coins);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch user coins", error: err.message });
  }
};
