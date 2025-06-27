const Order = require("../models/order.js");
const  User = require("../models/user.js");

exports.createOrder = async (req, res) => {
  try {
    const { orderData, userId } = req.body;

    const dbUser = await User.findOne({ clerkUserId: userId });
    if (!dbUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const order = new Order({
      ...orderData,
      owner: dbUser._id,
    });

    await order.save();
    res.status(200).json(order);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.query;
    const dbUser = await User.findOne({ clerkUserId: userId });

    if (!dbUser) return res.status(404).json({ message: "User not found" });

    const userOrders = await Order.find({ owner: dbUser._id });

    res.status(200).json(userOrders);
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("owner", "name");

    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getOrderById = async (req,res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(updatedOrder);
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ message: "Server error" });
  }
};

