"use strict"
const app = require("../app");
const express = require("express");
const router = express.Router();
const Users = require('../models/users');

//Route to handle Post Request Call
router.post("/", async (req, res) => {
  console.log("reached login"+JSON.stringify(req.body))

   
   
    Users.findOne({ emailId:req.body.userEmail}, (err, user) => {
        if (err) {
          res.status(500).end("System Error");
        }
        if (!user) {
          
          res.status(401).end("No such user exists");
        }
        else {
          if (req.body.password===user.password) {
            const payload = { _id: user._id, name: user.name, emailId:user.emailId};
            console.log("success")
            // res.status = 200;
            // res.message = payload;
            res.status(200).end("success");
          }
          else {
            res.status(401).end("Incorrect password");
          }
        }
        
    })
      });
module.exports = router;