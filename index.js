// load the mysql library
var mysql = require('mysql');
var util = require('util');
// create a connection to our Cloud9 server
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'pluk74', // CHANGE THIS :)
  password : '',
  database: 'reddit_workshop'
});

// load our API and pass it the connection
var reddit = require('./reddit');
var redditAPI = reddit(connection);

// It's request time!
// redditAPI.createUser({
//   username: 'david',
//   password: 'xxx'
// }, function(err, user) {
//   if (err) {
//     console.log(err);
//   }
//   else {
//     redditAPI.createPost({
//       title: 'look at this',
//       url: 'https://www.reddit.com',
//       userId: user.id,
//       subredditId: '1'
//     }, function(err, post) {
//       if (err) {
//         console.log(err);
//       }
//       else {
//         console.log(post);
//       }
//     });
//   }
// });

// redditAPI.createComment({
//   text: 'I agree',
//   userId: 5,
//   postId: 2,
//   parentId: 1
// }, function(err)
//   {
//     console.log(err);
//   }
  
//   )


redditAPI.getCommentsForPost(2, 
function(err, result) {
  if(err){
    console.log(err);
  }
  else {
    //console.log(result);
    var arr = result.map(function(element){
     return {
        id : element.userId,
        text:element.commentText,
        createdAt:element.createdAt,
        updatedAt:element.updatedAt,
        username:element.username,
        replies:[{
          id:element.reply1userId,
          text:element.reply1commentText,
          createdAt:element.reply1createdAt,
          updatedAt:element.reply1updatedAt,
          username:element.reply1username,
          replies:[{}]
        }]
      };
    });
    // arr.forEach(function(element){
    //   console.log(element.id);
    // });
  //console.log(arr);
  console.log(util.inspect(arr, { showHidden: true, depth: null,colors: true }));
  }
} 

);