const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.get("/me", authController.auth, authController.getMe);
router.post("/logout", authController.auth, authController.logout);
router.post("/logoutAll", authController.auth, authController.logoutAll);

router
  .route("/")
  .get(authController.auth, userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
