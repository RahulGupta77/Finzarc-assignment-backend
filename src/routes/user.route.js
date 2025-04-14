const express = require("express");
const router = express.Router();
const { userController } = require("../controllers");
const { userAuth } = require("../middlewares/auth");

// router.get("/", userAuth, userController.getUserDetails);
// router.put("/", userAuth, userController.submitUserDetails);

module.exports = router;
