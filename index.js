var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');


var app = express();
// load the mysql library
var mysql = require('mysql');
var util = require('util');
// create a connection to our Cloud9 server
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'pluk74',
  password: '',
  database: 'reddit_workshop'
});

// load our API and pass it the connection
var reddit = require('./reddit');
var redditAPI = reddit(connection);


// redditAPI.createOrUpdateVote(
//   {
//     postId: 24,
//     userId: 23,
//     vote: 0
//   }, function(err, vote) {
//     if(err) {
//       console.log(err);
//     }
//     else {
//       console.log(vote);
//     }
//   }
// )
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
//   text: 'no, you do not',
//   userId: 9,
//   postId: 2,
//   parentId: 3
// }, function(err)
//   {
//     console.log(err);
//   }

//   )


// redditAPI.getCommentsForPost(2, 
// function(err, result) {
//   if(err){
//     console.log(err);
//   }
//   else {
//     //console.log(result);
//     var arr = result.map(function(element){
//     return {
//         id : element.userId,
//         text:element.commentText,
//         createdAt:element.createdAt,
//         updatedAt:element.updatedAt,
//         username:element.username,
//         replies:[{
//           id:element.reply1userId,
//           text:element.reply1commentText,
//           createdAt:element.reply1createdAt,
//           updatedAt:element.reply1updatedAt,
//           username:element.reply1username,
//           replies:[{}]
//         }]
//       };
//     });
//     // arr.forEach(function(element){
//     //   console.log(element.id);
//     // });
//   //console.log(arr);
//   console.log(util.inspect(arr, { showHidden: true, depth: null,colors: true }));
//   }
// } 

// );

// function getHomepage(page, callback) {
//     connection.query(`SELECT posts.*, users.username AS userCreator FROM posts INNER JOIN users ON posts.userId=users.id`, function(err, res) {
//         if (err) {
//             callback(err);
//         }
//         else {
//             callback(null, res);
//         }
//     });
// }

// app.get('/homepage', function(req, res) {
//   res.send('Hello World!');
// });
app.use(bodyParser());
app.use(cookieParser());
app.use(function(request, response, next) {
  //console.log('this is the middleware: '+request.cookies.session);
  if (request.cookies.session) {
    //console.log('sfsdfsdds'+request.cookies.session);
    redditAPI.getUserFromSession(request.cookies.session, function(err, user) {
      if (err) {
        console.log('A: ' + err);
      }
      else {
        if (user) {
          request.loggedInUser = user;
          console.log('B:  ' + user);
        }
        next();
      }


    });

  }
  else {
    next();
  }
});





app.get('/homepage', function(request, response) {

  response.redirect('/homepage/newest');
});

app.get('/homepage/:sort', function(request, response) {

  //var page = request.query.page || 1;
  //var sortBy = request.params.sort;
  var sortBy;
  switch (request.params.sort.toLowerCase()) {
    case 'top':
      sortBy = 'votes';
      break;
    case 'hot':
      sortBy = 'hot';
      break;
    case 'newest':
      sortBy = 'created';
      break;
    case 'controversial':
      sortBy = 'controversial';
      break;
    default:
      sortBy = 'id';
      break;
  }
  redditAPI.getAllPosts({
    sortBy: sortBy
  }, function(err, posts) {
    var output = `${request.loggedInUser}<div>${sortBy}
  
    
    </div><div id="contents"><h1>List of contents</h1><ul class="contents-list">`;
    if (err) {
      console.log(err);
      response.status(500).send('whoops try again later!');
    }
    else {
      posts.map(function(element) {
        console.log(element.id + ", " + element.ups);
        output = output + `<li class="content-item"><h2 class="content-item__title"><a href="` + element.url + `">` + element.title + ` </a></h2><span style="color:red">` + element.votes + `</span>
          <p><a href="/comments?postid=${element.id}">${element.comments} comments</a></p><p>Created by ` + element.username + `</p></li>`;
        output = output + `<form action="/vote" method="post">
  <input type="hidden" name="vote" value="1">
  <input type="hidden" name="postId" value="${element.id}">
  <button type="submit">upvote this</button>
</form>up votes : ${element.ups}<p>down votes : ${element.downs}</p>
<form action="/vote" method="post">
  <input type="hidden" name="vote" value="-1">
  <input type="hidden" name="postId" value="${element.id}">
  <button type="submit">downvote this</button>
</form>`;
        return;
      });
      output = output + "</ul></div>";
      //console.log(output);
      response.send(output);
    }
  })
});

app.get('/comments', function(req, res) {
  
  var postid = req.query.postid;
  console.log('rhinoceros: '+postid);
  redditAPI.getCommentsForPost(postid, function(err, result) {
    if(err){
      console.log(err);
    }
    else {
      res.send(result);
    }
  });
});

app.get('/:name', function(req, res) {

  var options = {
    root: '/home/ubuntu/workspace/',
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  };

  var fileName = req.params.name;
  res.sendFile(fileName, options, function(err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
    else {
      console.log('Sent:', fileName);
    }
  });

});



// app.get('/calculator/:operation', function(request, response) {
//   var op = request.params.operation;
//   var postid = request.query.postid;
//   var num2 = request.query.num2;
//   response.send(calculate(op,parseInt(num1),parseInt(num2)));
// });

app.post('/vote', function(req, res) {
  //console.log('unicorn: '+parseInt(req.body.vote) );
  if (!req.loggedInUser) {
    res.status(401).send(`You must be logged in to vote!<p><a href='/homepage')>Go to Homepage</a></p>`);
  }
  else {
    //console.log("tada!!");
    redditAPI.createOrUpdateVote({
      postId: req.body.postId,
      userId: req.loggedInUser,
      vote: parseInt(req.body.vote)
    }, function(err, result) {
      if (err) {
        console.log(err);
      }
      else {
        console.log(result[0]);
        //res.redirect('/homepage');
        res.redirect(req.get('referer'));

      }
    })
  }
});

//   {
//     postId: 24,
//     userId: 23,
//     vote: 0
//   }

//[post.userId, post.title, post.url, post.subredditId, null]
app.post('/addpost', function(req, res) {

  // var response = {
  //   userId: req.loggedInUser.id,
  //   title: req.body.title,
  //   url: req.body.url,
  //   subredditId: 1
  // };
  //console.log('xxxxxxx: '+req.loggedInUser);
  if (!req.loggedInUser) {
    res.status(401).send(`You must be logged in to create content!<p><a href='/homepage')>Go to Homepage</a></p>`);
  }
  else {
    redditAPI.createPost({
      userId: req.loggedInUser,
      title: req.body.title,
      url: req.body.url,
      subredditId: 1
    }, function(err, user) {
      if (err) {
        console.log(err);
      }
      else {
        console.log(user);
        //console.log("cookie: " + req.cookies);
        res.redirect('/homepage');
      }
    });
  }

});

app.post('/adduser', function(req, res) {
  //console.log(req.cookies, "blaha");
  var response = {
    username: req.body.username,
    password: req.body.password
  };
  redditAPI.createUser(response, function(err, user) {
    if (err) {
      console.log(err);
    }
    else {
      //console.log(user);
      //res.cookie('username',response.username);
      //console.log("cookie: " + req.cookies);
      res.redirect('/homepage');
      // redditAPI.getToken(user.userId,function(err, user) {
      //   if(err) {
      //     console.log(err);
      //   }
      //   else {
      //     console.log(user);
      //     res.redirect('/homepage');
      //   }
      // })
    }
  });
});


app.post('/login', function(req, res) {
  //res.redirect('/homepage');
  redditAPI.validatePassword(req.body.username, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
    }
    else {
      console.log('user here! ' + user + ' , userid: ' + user.id);
      // res.redirect('/homepage');
      redditAPI.getToken(user.id, function(err, token) {
        if (err) {
          //console.log('getToken error')
          console.log(err);
        }
        else {
          console.log('token here!');
          res.cookie('session', token);
          res.redirect('/homepage');
        }
      })
    }
  })
});



// Boilerplate code to start up the web server
var server = app.listen(process.env.PORT, process.env.IP, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});