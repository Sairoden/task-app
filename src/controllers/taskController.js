const Task = require("../models/taskModel");

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json({
      status: "success",
      results: tasks.length,
      data: {
        tasks,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: `${err}`,
    });
  }
};

exports.getTask = async (req, res) => {
  try {
    const _id = req.params.id;
    const task = await Task.findById(_id);

    if (!task)
      res.status(404).json({ status: "fail", message: "No task found" });

    res.status(200).json({
      status: "success",
      data: {
        task,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: `${err}`,
    });
  }
};

exports.createTask = async (req, res) => {
  try {
    const task = new Task({
      description: req.body.description,
      completed: req.body.completed,
    });

    await task.save();

    res.status(201).json({
      status: "success",
      data: {
        task,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: `${err}`,
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    console.log(updates);
    const allowedUpdates = ["description", "completed"];
    const isValidOperation = updates.every(update =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation)
      return send
        .status(400)
        .json({ status: "fail", message: "Invalid updates" });

    const task = await Task.findById(req.params.id);

    updates.forEach(update => (task[update] = req.body[update]));
    await task.save();

    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    if (!task)
      return res.status(404).json({ status: "fail", message: "No task found" });

    res.status(200).json({
      status: "success",
      data: {
        task,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: `${err}`,
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task)
      return res
        .status(404)
        .json({ status: "fail", message: "No task found!" });

    res.status(200).json({ status: "success" });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: `${err}`,
    });
  }
};
