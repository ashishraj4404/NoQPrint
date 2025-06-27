const express = require("express");
const router = express.Router();
const {
  createOrderCheckoutSession,
  createCoinsCheckoutSession,
} = require("../controllers/stripeController.js");

router.post("/order", createOrderCheckoutSession);
router.post("/coins", createCoinsCheckoutSession);

module.exports = router;
