const express = require("express");

const taskController = require("../controllers/task");
const taskValidator = require("../validators/task");

const router = express.Router();


router.post("/tasks", taskValidator.createTask, taskController.createTask);
router.put("/tasks/:taskId", taskValidator.editTask, taskController.editTask);
router.delete("/tasks/:taskId", taskValidator.deleteTask, taskController.deleteTask);

router.put("/tasks/completed/:taskId", taskValidator.completedTask, taskController.setCompleted);
router.put("/tasks/uncompleted/:taskId", taskValidator.uncompletedTask, taskController.unsetCompleted);
module.exports = router;