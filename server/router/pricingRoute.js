const express = require("express");
const router = express.Router();
const PricingController = require("../controllers/pricingController.js");
const {isAdmin} = require("../middlewares.js");

router.get("/", PricingController.getPricing);
router.put("/", isAdmin, PricingController.updatePricing);

module.exports = router;
