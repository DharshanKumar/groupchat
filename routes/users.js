var crypto = require("crypto");
var express = require('express'); 
var user = require("../models/users_model.js");
const router = express.Router();
var UserModel = new user();
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

router.all('/create', function(req,res){
    if(req.method.toLowerCase() != "post") {
        res.render("signup.jade", {layout: false});
    }else{
        new user(req.body).save( function(err,contact){
            if( err ){
                res.json("Unsuccessful, please contact admin.");
            }else{
                res.json("Signup successfully done, Please login.");
            }
        })
    }
})

router.get("/index",function(req,res){
    user.find(function(err,users){
        res.json(users);
    })
})

router.all( '/login', function(req, res) {
    if(req.method.toLowerCase() != "post") {
        res.render("login.jade", {layout: false});
    } else {
        user.findOne({email: req.body.email}, function(err, result) {
            if(err) console.log(err);

            if(result == null) {
                res.send('invalid username', 
                {'Content-type' : 'text/plain'}, 
                    403);
            } else {
                auth(result);
            }
            function auth( userRes ) {
                if( UserModel.encrypt(req.body.password) != userRes.password) {
                    res.send('invalid password', 
                    {'Content-type' : 'text/plain'}, 
                      403);
                } else {
                    user.update({_id : userRes._id}, {'$set' : {token : Date.now}});
                    res.send( "Logged in successfully" );
                }
            }
        });
    }
});

module.exports = router;