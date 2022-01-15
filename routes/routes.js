const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller");

router.get("/users", controller.getUsers); //route to get all users with their related tweets and comments
router.post("/tweet", controller.postTweet); //route to post a tweet for a certain user
router.post("/tweets/:tweetId/comment", controller.postCommentOnTweet); //route to post a comment on a certain tweet
router.post(
  "/tweets/:tweetId/comments/:commentId/comment",
  controller.postCommentOnComment
);
//the last route to post a comment on another comment, the current approach is to only add comment on parent comments
//no posting of subcomment on another subcomments

module.exports = router;
