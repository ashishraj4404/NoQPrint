const Order = require("../models/order.js");

exports.confirmOrder = async (orderId) => {
    try {
         const order = await Order.findById(orderId);
         if(order && order.status === "Pending") {
            order.status = "Processing"
            await order.save();
         }
    }
    catch(err) {
        console.log(err);
    }
}