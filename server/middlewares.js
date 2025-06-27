const User = require("./models/user.js");


exports.isUser = (req, res, next) => {
  if (!req.auth || !req.auth.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

exports.isAdmin = async (req, res, next) => {
  try {
    const clerkUserId = req.auth.userId;
    if (!clerkUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const dbUser = await User.findOne({ clerkUserId });
    if (!dbUser || dbUser.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    next();
  } catch (error) {
    console.error("Admin check error:", error);
    res.status(500).json({ message: "Server error during admin check" });
  }
};
