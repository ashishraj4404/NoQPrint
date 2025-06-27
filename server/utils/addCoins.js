const User = require("../models/user.js");

exports.addCoins = async (userId, amount) => {
    try {
        const user = await User.findOne({ clerkUserId: userId });
        user.coins += amount;
        await user.save();
    } catch (err) {
        console.log(err);
    }
}