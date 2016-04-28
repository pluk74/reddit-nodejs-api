var bcrypt = require('bcrypt');
var HASH_ROUNDS = 10;

module.exports = function RedditAPI(conn) {
  return {
    createUser: function(user, callback) {

      // first we have to hash the password...
      bcrypt.hash(user.password, HASH_ROUNDS, function(err, hashedPassword) {
        if (err) {
          callback(err);
        }
        else {
          conn.query(
            'INSERT INTO `users` (`username`,`password`, `createdAt`) VALUES (?, ?, ?)', [user.username, hashedPassword, null],
            function(err, result) {
              if (err) {
                /*
                There can be many reasons why a MySQL query could fail. While many of
                them are unknown, there's a particular error about unique usernames
                which we can be more explicit about!
                */
                if (err.code === 'ER_DUP_ENTRY') {
                  callback(new Error('A user with this username already exists'));
                }
                else {
                  callback(err);
                }
              }
              else {
                /*
                Here we are INSERTing data, so the only useful thing we get back
                is the ID of the newly inserted row. Let's use it to find the user
                and return it
                */
                conn.query(
                  'SELECT `id`, `username`, `createdAt`, `updatedAt` FROM `users` WHERE `id` = ?', [result.insertId],
                  function(err, result) {
                    if (err) {
                      callback(err);
                    }
                    else {
                      /*
                      Finally! Here's what we did so far:
                      1. Hash the user's password
                      2. Insert the user in the DB
                      3a. If the insert fails, report the error to the caller
                      3b. If the insert succeeds, re-fetch the user from the DB
                      4. If the re-fetch succeeds, return the object to the caller
                      */
                      callback(null, result[0]);
                    }
                  }
                );
              }
            }
          );
        }
      });
    },
    getAllSubreddits: function(callback) {
      conn.query(`SELECT name FROM subreddits ORDER by subredditsId DESC`,
        function(err, result) {
          if (err) {
            callback(err);
          }
          else {
            callback(result);
          }
        })
    },
    createSubreddit: function(sub, callback) {
      conn.query(
        `INSERT INTO subreddits (name, description, createdAt) 
        VALUES (?,?,?)`, [sub.name, sub.description, null],
        function(err, result) {
          if (err) {
            callback(err);
          }
          else {
            /*
            Post inserted successfully. Let's use the result.insertId to retrieve
            the post and send it to the caller!
            */
            conn.query(
              'SELECT `subredditsId`,`name`,`description`, `createdAt`, `updatedAt` FROM `subreddits` WHERE `subredditsId` = ?', [result.insertId],
              function(err, result) {
                if (err) {
                  callback(err);
                }
                else {
                  callback(null, result[0]);
                }
              }
            );
          }
        }
      );
    },
    createPost: function(post, callback) {
      conn.query(
        'INSERT INTO `posts` (`userId`, `title`, `url`, subredditId, `createdAt`) VALUES (?, ?, ?, ?, ?)', [post.userId, post.title, post.url, post.subredditId, null],
        function(err, result) {
          if (err) {
            callback(err);
          }
          else {
            /*
            Post inserted successfully. Let's use the result.insertId to retrieve
            the post and send it to the caller!
            */
            conn.query(
              'SELECT `id`,`title`,`url`,`userId`, subredditId, `createdAt`, `updatedAt` FROM `posts` WHERE `id` = ?', [result.insertId],
              function(err, result) {
                if (err) {
                  callback(err);
                }
                else {
                  callback(null, result[0]);
                }
              }
            );
          }
        }
      );
    },
    getAllPostsForUser: function(userId, options, callback) {
      // In case we are called without an options parameter, shift all the parameters manually
      if (!callback) {
        callback = options;
        options = {};
      }
      var limit = options.numPerPage || 25; // if options.numPerPage is "falsy" then use 25
      var offset = (options.page || 0) * limit;

      conn.query(`
        SELECT \`a.id\`,\`a.title\`,\`a.url\`,\`a.userId\`, \`a.createdAt\`, \`a.updatedAt\`,
        \`b.name\`,
        c.id, c.username, c.createdAt, c.updatedAt
        FROM \`posts\` a
        INNER JOIN \`subreddits\` b ON a.subredditId = b.subredditId
        INNER JOIN users c ON  a.userid = c.id
        WHERE c.userid = ?
        ORDER BY \`createdAt\` DESC
        LIMIT ? OFFSET ?
        `, [userId, limit, offset],
        function(err, results) {
          if (err) {
            callback(err);
          }
          else {
            callback(null, results);
          }
        }
      );
    },
    getSinglePost: function(postId, callback) {


      conn.query(`
        SELECT \`a.id\`,\`a.title\`,\`a.url\`,\`a.userId\`, \`a.createdAt\`, \`a.updatedAt\`,
        \`b.name\`,
        c.id, c.username, c.createdAt, c.updatedAt
        FROM \`posts\` a
        INNER JOIN \`subreddits\` b ON a.subredditId = b.subredditId
        INNER JOIN users c ON  a.userid = c.id
        WHERE a.id = ?
        ORDER BY \`createdAt\` DESC

        `, [postId],
        function(err, results) {
          if (err) {
            callback(err);
          }
          else {
            callback(null, results);
          }
        }
      );
    },
    createComment: function(comment, callback) {
      conn.query(
        'INSERT INTO comments (commentText, userId, postId, parentId, createdAt) VALUES (?, ?, ?, ?, ?)', [comment.text, comment.userId, comment.postId, comment.parentId, null],
        function(err, result) {
          if (err) {
            callback(err);
          }
          else {
            /*
            Post inserted successfully. Let's use the result.insertId to retrieve
            the post and send it to the caller!
            */
            conn.query(
              'SELECT commentId, commentText,`userId`, postId,parentId, `createdAt`, `updatedAt` FROM comments WHERE commentId = ?', [result.insertId],
              function(err, result) {
                if (err) {
                  callback(err);
                }
                else {
                  callback(null, result[0]);
                }
              }
            );
          }
        }
      );
    },
    getAllPosts: function(options, callback) {
      // In case we are called without an options parameter, shift all the parameters manually
      if (!callback) {
        callback = options;
        options = {};
      }
      var limit = options.numPerPage || 25; // if options.numPerPage is "falsy" then use 25
      var offset = (options.page || 0) * limit;

      conn.query(`
        SELECT \`a.id\`,\`a.title\`,\`a.url\`,\`a.userId\`, \`a.createdAt\`, \`a.updatedAt\`,
        \`b.name\`,
        c.id, c.username, c.createdAt, c.updatedAt
        FROM \`posts\` a
        INNER JOIN \`subreddits\` b ON a.subredditId = b.subredditId
        INNER JOIN users c ON  a.userid = c.id
        ORDER BY \`createdAt\` DESC
        LIMIT ? OFFSET ?
        `, [limit, offset],
        function(err, results) {
          if (err) {
            callback(err);
          }
          else {
            callback(null, results);
          }
        }
      );
    },
    getCommentsForPost: function(postId, callback) {

      conn.query(`
        SELECT a.userId, a.commentText, a.createdAt, a.updatedAt,u.username,
        b.userId AS reply1userId, b.commentText AS reply1commentText, b.createdAt AS reply1createdAt, b.updatedAt AS reply1updatedAt, u2.username reply1username
        FROM comments a 
        LEFT OUTER JOIN comments b ON a.commentId = b.parentId
        LEFT OUTER JOIN users u ON a.userId = u.id
        LEFT OUTER JOIN users u2 ON b.userId =  u2.id

        WHERE a.parentId IS NULL
        AND a.postId = ?
        `, [postId],
        function(err, results) {
          if (err) {
            callback(err);
          }
          else {
            callback(null, results);
          }
        }
      );
    }
  }
}
