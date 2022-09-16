const Task = require("../models/Task");
const User = require("../models/User");

//createTask
exports.createTask = async (req, res) => {
  try {
    if (Object.keys((req.body)).length == 3){
      const newTaskData = {
        date: req.body.date,
        task: req.body.task,
        status: req.body.status,
        owner: req.user._id,
      };
  
      if (req.body.status == "Completed" || req.body.status == "Incomplete") {
        const task = await Task.create(newTaskData);
  
        const user = await User.findById(req.user._id);
  
        user.tasks.unshift(task._id);
        await user.save();
  
        //get Tasks
        let tasks = [];
        for (i = 0; i < user.tasks.length; i++) {
          const taskData = await Task.findById(user.tasks[i]);
          tasks.push(taskData);
        }
  
        res.status(201).json({
          success: true,
          message: "Task created..",
          tasks,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Please enter Status either Completed / Incomplete",
        });
      }
    }else{
      res.status(500).json({
        success: false,
        message: "Invalid/Extra keys passed",
      });
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//getTasks
exports.getTasks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    //get Tasks
    let tasks = [];
    for (i = 0; i < user.tasks.length; i++) {
      const taskData = await Task.findById(user.tasks[i]);
      tasks.push(taskData);
    }

    res.status(201).json({
      success: true,
      message: "Tasks getting successfully..",
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//removeTask
exports.removeTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (task.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await task.remove();

    const user = await User.findById(req.user._id);

    const index = user.tasks.indexOf(req.params.id);
    user.tasks.splice(index, 1);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Task deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//updateTask
exports.updateTask = async (req, res) => {
  try {
    if (Object.keys((req.body)).length <= 3){
      const task = await Task.findById(req.params.id);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: "Task not found",
        });
      }
  
      if (task.owner.toString() !== req.user._id.toString()) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }
      if (req.body) {
        if (req.body.status &&(req.body.status == "Completed" || req.body.status == "Incompleted")
        ) {
          await Task.findByIdAndUpdate(req.params.id, req.body, {
            runValidators: true,
          });
  
          const tasks = await Task.findById(req.params.id);
          res.status(200).json({
            success: true,
            message: "Task Updated",
            tasks,
          });
        } else if (!req.body.status) {
            await Task.findByIdAndUpdate(req.params.id, req.body, {
              runValidators: true,
            });
  
            const tasks = await Task.findById(req.params.id);
            res.status(200).json({
              success: true,
              message: "Task Updated",
              tasks,
            });
          } else {
            res.status(500).json({
              success: false,
              message: "Please enter Status either Completed / Incomplete",
            });
          }
        
      } else {
        res.status(500).json({
          success: false,
          message: "Empty request..",
        });
      }
    }else{
      res.status(500).json({
        success: false,
        message: "Invalid/Extra keys passed",
      });
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
