const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, "Please enter Date"],
  },
  task: {
    type: String,
    required: [true, "Please enter Task"],
  },
  status: {
    type: String,
    required: [true, "Please enter Status either Completed / Incomplete"],
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Task", taskSchema);
