const express = require("express");
const router = express.Router();
const { storage } = require("../utils/cloudConfig.js");
const multer = require("multer");
const upload = multer({ storage });
const UploadController = require("../controllers/uploadController.js");


router.post("/",  upload.array("files"), UploadController.uploadFiles);

module.exports = router;
