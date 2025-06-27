const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/orderController.js");
const {isUser, isAdmin} = require("../middlewares.js");

router.post("/", isUser, OrderController.createOrder);
router.get("/", isUser, OrderController.getUserOrders);
router.get("/all", isAdmin, OrderController.getAllOrders);
router.get("/:id", OrderController.getOrderById);
router.put("/:id", isUser, OrderController.updateOrder);

module.exports = router;
