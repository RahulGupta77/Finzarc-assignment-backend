const express = require("express");
const router = express.Router();
const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const taskRoute = require("./task.route");

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/task", taskRoute);

module.exports = router;
