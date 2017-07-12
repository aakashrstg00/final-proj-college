const express = require('express');
var router = express.Router();
var path = require('path');
var bcrypt = require('bcryptjs');
//
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/../public/index.html'));
});
//
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/../public/login.html'));
});
//
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '/../public/register.html'));
});
//
//
router.post('/login', function (req, res) {
    var user = {
        email: req.body.email
        , pass: req.body.pass
    };
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: 'localhost'
        , user: 'root'
        , password: 'aakash'
        , database: 'imdb2'
    });
    var loginUser = 'SELECT * FROM user WHERE email="' + user.email + '" AND pass="' + user.pass + '";';
    try {
        connection.query(loginUser, function (err, data) {
            var msg = '';
            if (err) {
                msg = 'Error';
                res.send(msg);
            }
            else {
                if (data.length) {
                    //msg = 'Logged in as ' + data[0].name;
                    res.render('profile', {
                        name: data[0].name
                    });
                }
                else {
                    msg = 'Invalid Email or Password!!';
                    res.send(msg);
                }
            }
        });
    }
    catch (err) {
        res.send("Error Occured!");
        console.log("Error Occured!");
    }
});
//
router.post('/register', function (req, res) {
    var newUser = {
        name: req.body.name
        , email: req.body.email
        , pass: req.body.pass
    };
    if (newUser.name && newUser.email && newUser.pass) {
        var mysql = require('mysql');
        var connection = mysql.createConnection({
            host: 'localhost'
            , user: 'root'
            , password: 'aakash'
            , database: 'imdb2'
        });
        var createUser = 'INSERT INTO user(name,email,pass) VALUES("' + newUser.name + '","' + newUser.email + '","' + newUser.pass + '");';
        try {
            connection.query(createUser, function (err, data) {
                var msg = '';
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        msg = 'This email has already been registered!! Enter another email or Try logging in instead.';
                    }
                }
                else {
                    msg = 'Registration Successful!';
                }
                res.send(msg);
            });
        }
        catch (err) {
            res.send("Error Occured!");
            console.log("Error Occured!");
        }
    }
    else {
        res.send("Enter credentials properly!!");
    }
});
router.get('/getmovie', (req, res) => {
    var title = req.query.title;
    title = add(title);
    var url = 'http://www.omdbapi.com/?apikey=ec6483bd&plot=full&t=' + title;
    var request = require('request');
    var reqs = request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.render('movie', JSON.parse(body));
        }
    })
});
router.post('/rate', (req, res) => {
    var rating = {
        rating: req.body.rating
        , movieid: req.body.movieid
        , userid: 23338
    };
    console.dir(rating);
    if (rating.rating) {
        var addRating = 'INSERT INTO ur VALUES("' + rating.userid + '","' + rating.movieid + '","' + rating.rating + '");';
        var mysql = require('mysql');
        var connection = mysql.createConnection({
            host: 'localhost'
            , user: 'root'
            , password: 'aakash'
            , database: 'imdb2'
        });
        try {
            connection.query(addRating, function (err, data) {
                var msg = '';
                if (err) {
                    msg = 'Unable to add your rating to database currently! Sorry for inconvinience.';
                }
                else {
                    msg = 'Rating Submitted!';
                }
                res.send(msg);
            });
        }
        catch (err) {
            res.send("Error Occured!");
            console.log("Error Occured!");
        }
    }
    else {
        res.send("Enter a rating!");
    }
});
/*

router.post('/rate', (req, res) => {
    var rating = {
        rating: req.body.rating
        , movieid: req.body.movieid
        , userid: req.session.userid
    }
    console.dir(rating);
    if (rating.rating) {
    if (rating.userid) {
        var addRating = 'INSERT INTO userrating VALUES("' + rating.userid + '","' + rating.movieid + '","' + rating.rating + '");';
        var mysql = require('mysql');
        var connection = mysql.createConnection({
            host: 'localhost'
            , user: 'root'
            , password: 'aakash'
            , database: 'imdb2'
        });
        try {
            connection.query(addRating, function (err, data) {
                var msg = '';
                if (err) {
                    msg = 'Unable to add your rating to database currently! Sorry for inconvinience.';
                }
                else {
                    msg = 'Rating Submitted!';
                }
                res.send(msg);
            });
        }
        catch (err) {
            res.send("Error Occured!");
            console.log("Error Occured!");
        }
    }
    else {
        res.redirect('/login');
    }
}
else {
    res.send("Enter a rating!");
}
});
*/
function add(mname) {
    for (i = 0; i < mname.length; i++) {
        if (mname[i] == ' ') {
            mname = mname.replace(' ', '+');
        }
    }
    return mname;
}
module.exports = router;