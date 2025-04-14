const express = require("express");
const router = express.Router();
const { taskController } = require("../controllers");
const { userAuth } = require("../middlewares/auth");

router.get("/", userAuth, taskController.getAllTasks); // done

router.post("/", userAuth, taskController.createTask); // done

router.get("/:id", userAuth, taskController.getTask); // done

router.put("/:id", userAuth, taskController.updateTask); // done

router.delete("/:id", userAuth, taskController.deleteTask);

module.exports = router;
