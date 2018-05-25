var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var Sequelize = require('sequelize');
var db = require('./db/db');
var User = db.users;
var Post = db.posts;
var Follower = db.followers;
const buzzWords = require('./config/config')
const Op = Sequelize.Op;


// invoke an instance of express application.
var app = express();

// set our application port
app.set('port', 9000);


app.use(express.static('./public')); 
// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json())

// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_sid',
    secret: "Shh, its a secret!",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: 600000
    }
}));


// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');        
    }
    next();
});


// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
    if (req.cookies.user_sid && req.session.user) {
        res.redirect('/dashboard');
    } else {
        next();
    }    
};


// route for Home-Page
app.get('/', sessionChecker, (req, res) => {
    res.redirect('/login');
});


// route for user signup
app.route('/signup')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/public/signup/signup.html');
    })
    .post((req, res) => {
        User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        })
        .then(user => {
            req.session.user = user.dataValues;
            res.redirect('/dashboard');
            console.log('Signed up and logged in.');
        })
        .catch(error => {
            console.log('Not signed up');
        });
    });


// route for user Login
app.route('/login')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/public/login/login.html');
    })
    .post((req, res) => {
        var username = req.body.username,
            password = req.body.password;

        User.findOne({ where: { username: username } }).then(function (user) {
            if (!user) {
                console.log('No user found with the credentials');
                res.redirect('/login');
            } else if (!user.validPassword(password)) {
                console.log('Invalid password');
                res.redirect('/login');
            } else {
                req.session.user = user.dataValues;
                console.log('logged in');
                res.redirect('/dashboard');
            }
        });
    });


// route for user logout
app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        console.log('logged out');
        res.redirect('/login');
    } else {
        console.log('logged out');
        res.redirect('/login');
    }
});

app.route('/dashboard')
    .get((req, res) => {
        if(req.session.user && req.cookies.user_sid){
            res.sendFile(__dirname + '/public/dashboard/dashboard.html');
        }
        else{
            res.redirect('/login');
        }
    });

app.route('/follow')
.post((req, res) => {
    if (req.cookies.user_sid && req.session.user) {
        Follower.create({
            follower_id: req.session.user.username,
            followed_id: req.body.userID,
        })
        .then(user => {
            console.log('Follow successfull.');
            res.send('You successfully followed ' + req.body.userID);
        })
        .catch(error => {
            console.log('Follow Unsuccessfull.');
            res.send('Follow Unsuccessfull.');
        });
    }
});

app.route('/userList')
.get((req, res) => {
    if (req.cookies.user_sid && req.session.user) {
        User.findAll({
            where: {
                username: {
                    [Op.ne]: req.session.user.username
                }
          }
        })
        .then(userList => {
            res.json(userList);
        })
        .catch(error => {
            res.send('Error Finding User List');
        });
    }
});

app.route('/createPost')
.post((req, res) => {
    if (req.cookies.user_sid && req.session.user) {
        Post.create({
            user_id: req.session.user.username,
            content: req.body.content,
            buzz_words: getNoOfBuzzWords(req.body.content)
        })
        .then(user => {
            console.log('Posted Successfully');
            res.send('Posted Successfully');
        })
        .catch(error => {
            console.log('Post Unsuccessfull.');
            res.send('Post Unsuccessfull.');
        });
    }
});

var getNoOfBuzzWords = function(content){
    count = 0;
    for(var word in buzzWords){
        count = count + content.toLowerCase().split(buzzWords[word].toLowerCase()).length - 1 ;
    }
    return count;
}
app.route('/followingList')
.get((req, res) => {
    if (req.cookies.user_sid && req.session.user) {
        Follower.findAll({
            where: {
                follower_id: req.session.user.username
          }
        })
        .then(userList => {
            res.json(userList);
        })
        .catch(error => {
            res.send('Error Finding Following List');
        });
    }
});

app.route('/getFeeds')
.get((req, res) => {
    if (req.cookies.user_sid && req.session.user) {

        Follower.findAll({
            where: {
                follower_id: req.session.user.username
          }
        })
        .then(followingUserList => {
            var followingUserIDList = followingUserList.map(function (obj) {
                return obj['followed_id'];
              });
            Post.findAll({
                where: {
                    user_id:{
                        [Op.or]: followingUserIDList
                      }
              }
            }).then(postList =>{
                postList = postList.filter((post) => {
                    return  ((new Date() - post.dataValues.created_at) / 36e5 <= 24);
                });
                postList.sort((a,b) => {
                    return b.dataValues.content.length - a.dataValues.content.length;
                });
                res.json(postList);

            });
        })
        .catch(error => {
            res.send('Error Finding Following List');
        });
    }
});

// route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
res.status(404).send("Sorry can't find that!")
});


// start the express server
app.listen(process.env.PORT || 8051, () => console.log(`App started on port ${app.get('port')}`));