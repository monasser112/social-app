const pool = require("../db");

exports.getUsers = (_req, res, _next) => {
  //query to get list of users tweets along with related comments and also name of the commenter
  pool.query(
    `
  SELECT u1.id, u1.name as Name, tweet.content as Tweet, comment.content as Comment, u2.id as CommentedById, u2.name as CommentedBy
  FROM user u1
  LEFT JOIN tweet on u1.id=tweet.userId
  LEFT JOIN comment on tweet.id=comment.tweetId
  LEFT JOIN user u2 on comment.userId=u2.id;
  `,
    (error, results, _fields) => {
      if (error) {
        return res.status(404).json({
          status: 404,
          message: error.sqlMessage,
        });
      }
      res.status(200).json({
        results,
      });
    }
  );
};

exports.postTweet = (req, res, _next) => {
  console.log(req);
  let userId = req.body.userId;
  let content = req.body.content;
  let tweet = {
    userId,
    content,
  };
  console.log("user:" + userId);
  console.log("content: " + content);

  //sql query to post tweet for a certain user

  pool.query(
    `
  INSERT INTO tweet (content, userId) VALUES(?, ?)
  `,
    [content, userId],
    (error, _results, _fields) => {
      if (error) {
        return res.status(404).json({
          status: 404,
          message: error.sqlMessage,
        });
      }
      res.status(200).json({
        message: "Tweet created successfully",
        tweet,
      });
    }
  );
};

exports.postCommentOnTweet = (req, res, _next) => {
  let tweetId = req.params.tweetId;
  let userId = req.body.userId;
  let content = req.body.content;

  let comment = {
    userId,
    content,
    tweetId,
  };

  pool.query(
    // checks if this tweet_id exists
    `
  SELECT * FROM tweet WHERE id=?
  `,
    [tweetId],
    (error, results, _fields) => {
      if (error) {
        return res.status(404).json({
          status: 404,
          message: error.sqlMessage,
        });
      }

      if (results.length) {
        //if tweet exists then insert comment on it
        pool.query(
          `
      INSERT INTO comment (content, tweetId, userId) VALUES(?, ?, ?)
      `,
          [content, tweetId, userId],
          (error, _results, _fields) => {
            if (error) {
              return res.status(404).json({
                status: 404,
                message: error.sqlMessage,
              });
            }
            res.status(200).json({
              //comment created succuessfully
              message: "Comment created successfully",
              comment,
            });
          }
        );
      } else {
        //else block that handles if the tweet does not exist
        return res.status(404).json({
          status: 404,
          message: "Tweet does not exist",
        });
      }
    }
  );
};

exports.postCommentOnComment = (req, res, _next) => {
  let { tweetId, commentId } = req.params;
  let { userId, content } = req.body;

  let comment = {
    userId,
    content,
    parentCommentId: commentId,
    tweetId,
  };

  pool.query(
    //get the comment on the tweet_id sent in the request
    `
  SELECT id from comment WHERE tweetId=?
  `,
    [tweetId],
    (error, results, _fields) => {
      if (error) {
        return res.status(404).json({
          status: 404,
          message: error.sqlMessage,
        });
      }
      if (results.length) {
        //check if this tweet does exists
        let filteredResults = results.filter(
          (result) => result.id == commentId
        ); //get the comment which mathces the one sent in request  on this tweet id
        if (filteredResults.length) {
          //check the comment which mathces the one sent in request  on this tweet id exists
          pool.query(
            `
        SELECT parentCommentId FROM comment WHERE id=?
        `,
            [filteredResults[0].id],
            (error, results, _fields) => {
              if (error) {
                return res.status(404).json({
                  status: 404,
                  message: error.sqlMessage,
                });
              }
              if (results[0].parentCommentId == null) {
                //checks if there is an existing sub comment or not,if null then insert the sub-comment.
                //the current scenario only adds subcomments on one parent comment and does not support
                //subcomment on another subcomment.
                pool.query(
                  `
            INSERT INTO comment (content, tweetId, userId, parentCommentId) VALUES(?, ?, ?, ?)
            `,
                  [content, tweetId, userId, commentId],
                  (error, _results, _fields) => {
                    if (error) {
                      return res.status(404).json({
                        status: 404,
                        message: error.sqlMessage,
                      });
                    }
                    res.status(200).json({
                      message: "Comment created successfully",
                      comment,
                    });
                  }
                );
              } else {
                return res.status(404).json({
                  status: 404,
                  message: "Can't create a sub-comment on another sub-comment",
                });
              }
            }
          );
        } else {
          return res.status(404).json({
            status: 404,
            message: "Comment does not exist",
          });
        }
      } else {
        return res.status(404).json({
          status: 404,
          message: "Tweet does not exist",
        });
      }
    }
  );
};
