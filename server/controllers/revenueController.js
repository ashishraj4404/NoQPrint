const Order = require("../models/order.js");
const moment = require("moment-timezone");

exports.getRevenueData = async (req, res) => {
  try {
    const now = moment().tz("Asia/Kolkata");
    const todayStart = now.clone().startOf("day").toDate();
    const weekStart = now.clone().startOf("isoWeek").toDate();
    const monthStart = now.clone().startOf("month").toDate();

    const filter = {
      $or: [{ status: "Completed" }, { paymentMode: "Online" }],
      createdAt: { $lte: now.toDate() },
    };

    const orders = await Order.find(filter);

    let today = 0, thisWeek = 0, thisMonth = 0, total = 0;
    const last10DaysMap = {};

    for (let i = 9; i >= 0; i--) {
      const date = now.clone().subtract(i, "days");
      const key = date.format("YYYY-MM-DD");
      last10DaysMap[key] = {
        date: key,
        displayDate: date.format("DD MMM"),
        income: 0,
      };
    }

    for (const order of orders) {
      const created = moment(order.createdAt).tz("Asia/Kolkata");
      const price = order.totalPrice || 0;

      total += price;
      if (created.isSameOrAfter(todayStart)) today += price;
      if (created.isSameOrAfter(weekStart)) thisWeek += price;
      if (created.isSameOrAfter(monthStart)) thisMonth += price;

      const dateKey = created.format("YYYY-MM-DD");
      if (last10DaysMap[dateKey]) {
        last10DaysMap[dateKey].income += price;
      }
    }

    const last10Days = Object.values(last10DaysMap);

    res.status(200).json({ today, thisWeek, thisMonth, total, last10Days });
  } catch (error) {
    console.error("Revenue API error:", error);
    res.status(500).json({ message: "Failed to fetch revenue data." });
  }
};
