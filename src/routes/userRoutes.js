const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.post("/logout", authController.auth, authController.logout);
router.post("/logoutAll", authController.auth, authController.logoutAll);

router
  .route("/me")
  .get(authController.auth, authController.getMe)
  .patch(authController.auth, authController.updateMe)
  .delete(authController.auth, authController.deleteMe)

router
  .route("/")
  .get(authController.auth, userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(authController.auth, userController.deleteUser);

module.exports = router;
