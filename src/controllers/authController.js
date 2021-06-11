const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
      token,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: `${err}`,
    });
  }
};

exports.signup = async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    await user.save();
    const token = await user.generateAuthToken();

    res.status(201).json({
      status: "success",
      data: {
        user,
      },
      token,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: `${err}`,
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    res.status(200).json({
      status: "success",
      data: {
        user: req.user,
      },
    });

    console.log(req.user);
  } catch (err) {
    res.status(401).json({
      status: "fail",
      message: `${err}`,
    });
  }
};

exports.auth = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    )
      token = req.headers.authorization.split(" ")[1];
    else if (req.cookies.jwt) token = req.cookies.jwt;

    if (!token)
      throw new Error("You are not logged in! Please log in to get access.");

    // const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "thisismycourse");
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) throw new Error("Invalid user");

    req.token = token;
    req.user = user;

    next();
  } catch (err) {
    res.status(401).json({
      status: "fail",
      message: `${err}`,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      token => token.token !== req.token
    );

    await req.user.save();

    res.status(200).json();
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: `${err}`,
    });
  }
};

exports.logoutAll = async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();

    res.status(200).json();
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: `${err}`,
    });
  }
};

exports.deleteMe = async (req, res) => {
  try {
    if (!req.user)
      res.status(404).json({ status: "fail", message: "No user found" });

    await req.user.remove();

    res.status(200).json({
      status: "success",
      data: {
        user: req.user,
      },
    });
  } catch (err) {
    res.status(401).json({
      status: "fail",
      message: `${err}`,
    });
  }
};

exports.updateMe = async (req, res) => {
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

    updates.forEach(update => (req.user[update] = req.body[update]));
    await req.user.save();

    res.status(200).json({
      status: "success",
      user: req.user,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: `${err}`,
    });
  }
};
