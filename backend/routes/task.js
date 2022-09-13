const express = require("express");
const {
  createTask,
  removeTask,
  getTasks,
  updateTask,
} = require("../controllers/task");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();

router.route("/task/createTask").post(isAuthenticated, createTask);

router.route("/task/getTasks").get(isAuthenticated, getTasks);

router.route("/task/deleteTask/:id").delete(isAuthenticated, removeTask);

router.route("/task/updateTask/:id").patch(isAuthenticated, updateTask);

module.exports = router;
