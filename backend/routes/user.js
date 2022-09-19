const express = require("express");
const {
  register,
  login,
  followUser,
  removeFollower,
  loggedOut,
  updatePassword,
  updateProfile,
  deleteMyProfile,
  myProfile,
  getAllUsers,
  getUserProfile,
  forgotPassword,
  resetPassword,
  getMyPosts,
  getUserPosts,
} = require("../controllers/user");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/auth");

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/loggedOut").post(loggedOut);

router.route("/follow/:id").get(isAuthenticated, followUser);

router.route("/removeFollower/:id").get(isAuthenticated, removeFollower);

router.route("/update/password").put(isAuthenticated, updatePassword);

router.route("/update/profile").put(isAuthenticated, updateProfile);

router.route("/delete/me").delete(isAuthenticated, deleteMyProfile);

router.route("/me").get(isAuthenticated, myProfile);

router.route("/users").get(isAuthenticated, getAllUsers);

router.route("/my/posts").get(isAuthenticated, getMyPosts);

router.route("/userPosts/:id").get(isAuthenticated, getUserPosts);

router.route("/user/:id").get(isAuthenticated, getUserProfile);

router.route("/forgot/password").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

module.exports = router;
