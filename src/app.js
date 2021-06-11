const express = require("express");
const userRouter = require("./routes/userRoutes");
const taskRouter = require("./routes/taskRoutes");

const app = express();

app.use(express.json());

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tasks", taskRouter);
app.all("*", (req, res) => {
  res.status(404).send("Page not found");
});

module.exports = app;
