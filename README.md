# social-app

- This app uses Mysql database.
- The database is already prefilled with some values for testing and i shall provide a script.sql for you that you can import it into mysql workbench.
- Tables are tweet,user and comment details are in the erd diagram.
- I used Node Js and express framework.
- Use Postman to test the required APIs

  1. Get User Tweets : GET request to this endpoint `localhost/users`
  2. Post a tweet: POST request to this endpoint `localhost/tweet`
     - You shoud pass in the body of the request a userId and content of tweet  and make the content-type as `application/json`. like below
      `{
         "userId":3,//you can change value
         "content":"hello"//you can change value
      }`
  3. Post a comment on a tweet: request to this endpoint `localhost/tweets/:tweetId/comment`
     - enter any Id for `tweetId` param.
     - You shoud pass in the body of the request a userId and content of tweet  and make the content-type as "application/json". like below
     `{
         "userId":3,//you can change value
         "content":"hello"//you can change value
      }`
      
     - so there are three variables tweetId from request params in the url and userId and content in the request body.  
  4. Post a comment on a comment:request to this endpoint `localhost/tweets/:tweetId/comments/:commentId/comment`
     - enter any Id for `tweetId` param.
     - enter any Id for `commentId` param.
     - You shoud pass in the body of the request a userId and content of tweet  and make the content-type as "application/json". like below
     `{
         "userId":3,//you can change value
         "content":"hello"//you can change value
      }`
