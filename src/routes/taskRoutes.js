const express = require("express");
const taskController = require("../controllers/taskController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.auth, taskController.getAllTasks)
  .post(authController.auth, taskController.createTask);

router
  .route("/:id")
  .get(authController.auth, taskController.getTask)
  .patch(authController.auth, taskController.updateTask)
  .delete(authController.auth, taskController.deleteTask);

module.exports = router;
