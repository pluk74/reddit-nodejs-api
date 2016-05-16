var bcrypt = require('bcrypt');
var secureRandom = require('secure-random');
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
                if (err.code === 'ER_DUP_ENTRY') {
                  callback(new Error('A user with this username already exists'));
                }
                else {
                  callback(err);
                }
              }
              else {
                conn.query(
                  'SELECT `id`, `username`, `createdAt`, `updatedAt` FROM `users` WHERE `id` = ?', [result.insertId],
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
          //console.log(result)
          if (err) {
            callback(err);
          }
          else {
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
          //console.log(result);
          if (err) {
            callback(err);
          }
          else {
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
            conn.query(
              'SELECT commentId, commentText,`userId`, postId,parentId, `createdAt`, `updatedat` FROM comments WHERE commentId = ?', [result.insertId],
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
      //console.log('start of getAllPosts functdion');
      if (!callback) {
        callback = options;
        options = {};
      }
      var limit = options.numPerPage || 25; // if options.numPerPage is "falsy" then use 25
      var offset = (options.page || 0) * limit;
      var orderBy = options.sortBy || 'created';
      //console.log("komodo dragon: "+ typeof orderBy);
      conn.query(`
        SELECT id, title,url,userId, created, updated,name, username, ups, downs, comments, votes
        FROM uv_AllPosts ORDER BY ?? DESC LIMIT ? OFFSET ?
        `, [orderBy, limit, offset],
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
    validatePassword: function(username, password, callback) {
      conn.query(`
        SELECT id, username, password FROM users WHERE username = ?`, [username],
        function(err, results) {
          if (err) {
            console.log(err);
          }
          else {
            if (results.length === 0) {
              callback(new Error('username or password incorrect'));
            }
            else {
              var user = results[0];
              var actualHashedPassword = user.password;
              bcrypt.compare(password, actualHashedPassword, function(err, result) {
                if (err) {
                  console.log(err)
                }
                else {
                  if (result === true) {
                    callback(null, user);
                  }
                  else {
                    callback(new Error('2. username or password incorrect'));
                  }
                }

              })
            }
          }
        }
      );
    },
    // createSessionToken: function() {
    //   return secureRandom.randomArray(100).map(code => code.toString(36)).join('');
    // },
    getToken: function(userId, callback) {
      var token = secureRandom.randomArray(100).map(code => code.toString(36)).join('');
      conn.query(
        `INSERT INTO sessions (userId, token, createdAt) VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE token = ?`, [userId, token, null, token],
        function(err, result) {
          if (err) {
            //console.log('gettoken result: '+result);
            callback(err);
          }
          else {
            callback(null, token);
          }
        }
      );
    },
    getUserFromSession: function(token, callback) {
      conn.query(`
        SELECT userId, token
        FROM sessions
        WHERE token = ?
        `, [token],
        function(err, results) {
          if (err) {
            //console.log('nothing!!!');
            callback(err);
          }
          else {
            // console.log('something!!!');
            // callback(null, results);
            if (results.length === 0) {
              //console.log('token not found');
              callback(new Error('session not found'));
            }
            else {
              //console.log('something found!!!.....' + results[0].userId);
              callback(null, results[0].userId);
            }
          }
        }
      );
    },
    getCommentsForPost2: function(postId, callback) {

      conn.query(`
        SELECT a.userId, a.commentText, a.createdAt, a.updatedAt,u.username
        FROM comments a 
        LEFT OUTER JOIN users u ON a.userId = u.id
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
    },
    getComments: function(maxLevel, parentIds, commentsMap, finalComments, callback) {
      var query;
      if (!callback) {
        // first time function is called
        callback = parentIds;
        parentIds = [];
        commentsMap = {};
        finalComments = [];
        query = 'select * from comments where parentId is null';
      }
      else if (maxLevel === 0 || parentIds.length === 0) {
        callback(null, finalComments);
        return;
      }
      else {
        query = 'select * from comments where parentId in (' + parentIds.join(',') + ')';
      }

      conn.query(query, function(err, res) {
        if (err) {
          callback(err);
          return;
        }
        res.forEach(
          function(comment) {
            commentsMap[comment.commentId] = comment;
            if (comment.parentId === null) {
              finalComments.push(comment);
            }
            else {
              var parent = commentsMap[comment.parentId];
              parent.replies = parent.replies || [];
              parent.replies.push(comment);
            }
          }
        );

        var newParentIds = res.map(function(item) {
          return item.id;
        });
        module.exports.getComments(maxLevel - 1, newParentIds, commentsMap, finalComments, callback);
      });
    },
    getVoteScore: function(postId, callback) {
      conn.query(`
      select sum(vote) score from votes where postId = ?`, [postId], function(err, results) {
        if (err) {
          callback(err);
        }
        else {
          callback(results);
        }
      });
    },
    createOrUpdateVote: function(vote, callback) {
      if ([1, 0, -1].indexOf(vote.vote) === -1) {
        callback(new Error('invalid vote value!'));
      }
      else {
        conn.query(`
        INSERT INTO votes (postId, userId, vote, createdAt)
        VALUES (?,?,?,?)  ON DUPLICATE KEY UPDATE vote = ?`, [vote.postId, vote.userId, vote.vote, null, vote.vote],
          function(err, results) {
            //console.log(results);
            if (err) {
              //console.log('tiger');
              callback(err);
            }
            else {
              //console.log('elephant: '+vote.postId+" , "+ vote.userId);
              conn.query(`
              SELECT postId, SUM(vote) score FROM votes WHERE postId = ? GROUP BY postId`, [parseInt(vote.postId)],
                function(err, results) {
                  if (err) {
                    //console.log("wolf");
                    callback(err);
                  }
                  else {
                    //console.log('giraffe');
                    callback(null, results);
                  }
                });
            }
          });
      }
    },
    renderLayout: function(pageTitle, isLoggedIn, content) {
      var html = `
      <!doctype>
      <html>
        <head>
         <link rel="shortcut icon" href="../robot-character1.ico" type="image/x-icon" /> 
         <link rel="stylesheet" type="text/css" href="../main.css">
          <title>${pageTitle}</title>
        </head>`;
      html = html + `
        <body>
          <div class = "header">
          <div class = "heading">
          <img class="robot" src="../readdit_robot.jpg" alt="readdit robot!" style="width:50px;height:50px;">
          <a href="/homepage/top"><h1>re<span id="mainTitle">[a]</span>ddit</h1></a>
          </div>
          <nav>
            <ul class="sortingMenu">
              <li class = "menuOption"><a href="/homepage/top">Top</a></li>
              <li class = "menuOption"><a href="/homepage/hot">Hot</a></li>
              <li class = "menuOption"><a href="/homepage/newest">Newest</a></li>
              <li class = "menuOption"><a href="/homepage/controversial">Controversial</a></li>
              <li class = "menuOption">${isLoggedIn ? '<a href="/logout">Logout</a></li>' : '<a href="/signin">Login</a></li><li><a href="/signup">Sign up!</a></li>'}
            </ul>
          </nav>
          
          </div>
          
          ${content}
          <script   src="https://code.jquery.com/jquery-1.12.3.js"   integrity="sha256-1XMpEtA4eKXNNpXcJ1pmMPs8JV+nwLdEqwiJeCQEkyc="   crossorigin="anonymous"></script>
          <script src="../script.js"></script>
          
        </body>
        <footer>&copy; 2016 readdit inc. All rights reserved.</footer>
      </html>`;
      return html;
    },
    logOut: function(userId, callback) {
      //console.log('hyena: '+'DELETE FROM sessions WHERE userId = '+userId);
      conn.query(`
        DELETE FROM sessions WHERE userId = ?`, [userId],
        function(err, results) {
          if (err) {
            //console.log('salmon');
            callback(err);
          }
          else {
            callback(null, results);
          }
        });
    },
    findTitle: function() {

    }
  };
};
