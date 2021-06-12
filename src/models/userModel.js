const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("../models/taskModel");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please tell us your email!"],
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  age: {
    type: Number,
    default: 5,
    validate(val) {
      if (val < 0) {
        throw new Error("Age must be a positive number");
      }
    },
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;

  const token = jwt.sign({ _id: user._id.toString() }, "thisismycourse");

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  // console.log(user);

  if (!user) throw new Error("Unable to login");

  const isMatch = await bcrypt.compare(password, user.password);
  console.log(isMatch);

  if (!isMatch) throw new Error("Unable to login");

  return user;
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

// Hasdh the plain text password before saving
userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  user.password = await bcrypt.hash(user.password, 12);

  next();
});

// Delete user tasks when user is removed
userSchema.pre("remove", async function (next) {
  const user = this;

  await Task.deleteMany({ owner: user._id });

   next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
