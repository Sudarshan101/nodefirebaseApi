// set up ========================

var express  = require('express');
var app      = express();                              // create our app w/ express
var Firebase = require('firebase');
var morgan = require('morgan');      
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override');
var multer  =   require('multer');
var fs = require("fs");
app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Max-Age", "3600");
    res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    next();
});
Firebase.initializeApp({
    databaseURL: "https://testapp-e5455.firebaseio.com/",
    serviceAccount: './testapp.json', //this is file that I downloaded from Firebase Console
});
var db = Firebase.database();
var usersRef = db.ref("users");

// var FirebaseRef = new Firebase("https://testapp-e5455.firebaseio.com/");
// configuration
app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use('/public/uploads',express.static(__dirname + '/public/uploads'));
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

app.get('/', function (req, res) {
  res.sendfile('./index.html')
})
 

// create user
app.post('/api/createUser', function(req, res) {
   // var userEmail = req.body.user_email;
   		var data = req.body;
		usersRef.push(data, function(err) {
			if (err) {
				res.send(err)
			} else {
				// var key = Object.keys(snapshot.val())[0];
				// console.log(key);
				res.json({message: "Success: User Save.", result: true});
			}
		});
});





// update user
app.put('/api/updateUser', function(req, res) {
    var uid = "-Ks8HilZxX5vtFPqGu75";
	var data = req.body;

	usersRef.child(uid).update(data, function(err) {
		if (err) {
			res.send(err);
		} else {
			usersRef.child("uid").once("value", function(snapshot) {
				if (snapshot.val() == null) {
					res.json({message: "Error: No user found", "result": false});
				} else {
					res.json({"message":"successfully update data", "result": true, "data": snapshot.val()});
				}
			});
		}
	});

});

// delete user
app.delete('/api/removeUser', function(req, res) {
    var uid = "-Ks8HilZxX5vtFPqGu75";

	usersRef.child(uid).remove(function(err) {
		if (err) {
			res.send(err);
		} else {
			res.json({message: "Success: User deleted.", result: true});
		}
	})
});

// get users
app.post('/api/getUsers', function(req, res) {
    var uid = "-Ks8HilZxX5vtFPqGu75";
	if (uid.length != 20) {
		res.json({message: "Error: uid must be 20 characters long."});
	} else {
		usersRef.once("value", function(snapshot) {
			//console.log(snapshot);
			if (snapshot.val() == null) {
				res.json({message: "Error: No user found", "result": false});
			} else {
				res.json({"message":"successfully fetch data", "result": true, "data": snapshot.val()});
			}
		});
	}
});

// login
app.post('/api/login', function(req, res) {

    User.findOne({ 'user_name' :  req.body.user_name, 'password' : req.body.password }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return res.send(err);
            // check to see if user exist
            if (user) {
                return res.json(user);
            } else {
                return res.json({"message":"Invalid Username or Password."});
            }

        });
});



app.listen(3000);
console.log("port is 3000");