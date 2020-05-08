"use strict"
const app = require("../app");
const express = require("express");
const router = express.Router();
const Users = require('../models/users');

//Route to handle Post Request Call
router.post("/", async (req, res) => {
console.log("reached signup")
var newUser = new Users({
    emailId: req.body.userEmail,
    password: req.body.password,
    name: req.body.name,
    
  });
  Users.findOne({ emailId: req.body.userEmail}, (err, user) => {
    if (err) {
      res.status(500).end("System Error");
  
    }
    if (user) {
      
   
      res.status(500).end("User Id already exists");
     
    }
    else {
      newUser.save((err, data) => {
        if (err) {
          res.status(500).end("Error in data");
        
        }
        else {
          res.status(200).end("User added");
        
        }
      });
    }
  });
})
module.exports = router;
