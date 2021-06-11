const User = require("../models/userModel");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: `${err}`,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const _id = req.params.id;

    const user = await User.findById(_id);

    if (!user)
      return res.status(404).json({ status: "fail", message: "No user found" });

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: `${err}`,
    });
  }
};

exports.createUser = async (req, res) => {
  res.status(500).json({
    status: "fail",
    message: `This route is not defined! Please use /signup instead`,
  });
};

exports.updateUser = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    console.log(updates);
    const allowedUpdates = ["name", "email", "password", "age"];
    const isValidOperation = updates.every(update =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation)
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid updates" });

    const user = await User.findById(req.params.id);

    updates.forEach(update => (user[update] = req.body[update]));
    await user.save();

    if (!user)
      return res.status(404).json({ status: "fail", message: "No user found" });

    res.status(200).json({
      status: "success",
      user,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: `${err}`,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user)
      res.status(404).json({ status: "fail", message: "No user found" });

    res.status(200).json({
      status: "success",
    });
  } catch (err) {
    res.status(401).json({
      status: "fail",
      message: `${err}`,
    });
  }
};
