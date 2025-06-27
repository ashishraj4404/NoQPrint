const express = require("express");
const router = express.Router();
const RevenueController = require("../controllers/revenueController.js");
const {isAdmin} = require("../middlewares.js");

router.get("/", isAdmin, RevenueController.getRevenueData);

module.exports = router;
