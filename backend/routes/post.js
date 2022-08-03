const express = require("express");
const {
  createPost,
  likeUnlikePost,
  removePost,
  getTimeLine,
  updateCaption,
  commentOnPost,
  deleteComment,
} = require("../controllers/post");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();

router.route("/post/upload").post(isAuthenticated, createPost);

router
  .route("/post/:id")
  .get(isAuthenticated, likeUnlikePost)
  .put(isAuthenticated, updateCaption)
  .delete(isAuthenticated, removePost);

router.route("/timeLine").get(isAuthenticated, getTimeLine);

router
  .route("/post/comment/:id")
  .put(isAuthenticated, commentOnPost)
  .delete(isAuthenticated, deleteComment);

module.exports = router;
