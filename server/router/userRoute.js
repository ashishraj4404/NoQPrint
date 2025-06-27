const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController.js");
const {isUser} = require("../middlewares.js");

router.post("/", UserController.createUser); 
router.get("/role", UserController.getUserByEmail);
router.get("/coins", isUser, UserController.getUserCoins);
router.post("/update-coins", isUser, UserController.updateUserCoins);

module.exports = router;
