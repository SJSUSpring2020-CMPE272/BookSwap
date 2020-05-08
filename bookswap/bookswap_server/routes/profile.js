"use strict"
const app = require("../app");
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const { secret } = require('../config/config');
const Users = require('../models/users');

router.post("/", async (req, res) => {
console.log("reached profile"+JSON.stringify(req.body))
  

Users.findOne({ _id: req.body.userId}, (err, user) => {
    if (err) {
      res.status = 500;
      res.message = "Database Error";
    }
    if (!user) {
      res.status = 401;
      res.message = "No such user exists";
    }
    else {
        const userProfile = { userId:user._id,
             name: user.name,
              emailId:user.emailId,
              aboutme:user.aboutme,
              contactNumber:user.contactNumber,
              city:user.city,
              state:user.state,
              country:user.country,
              image:user.image,
              
            };
     
        let payload = JSON.stringify(userProfile);
        res.status(200).end(payload);
    }
    
  });
})
  router.post("/update", async (req, res) => {
    console.log("reached update"+JSON.stringify(req.body))
  Users.findOne({ _id: req.body.userId}, (err, user) => {
    if (err) {
     res.status = 500;
      res.message = "Database Error";
   }
   if (!user) {
     res.status = 401;
     res.message = "No such user exists";
   }
   else {
       Users.findOneAndUpdate({ _id:req.body.userId },
           {
               name: req.body.userName,
               aboutme:req.body.userAboutMe,
               contactNumber:req.body.userContactNumber,
               city:req.body.userCity,
               state:req.body.userState,
               country:req.body.userCountry
           },
           {
             new: true
           },
           (err, updatedUser) => {
             if (err) {
               res.status = 500;
               res.message = "Error in Data";
             }
             if (updatedUser) {
               const payload={successFlag:"true"};
                res.status(200).end(JSON.stringify(payload));
             }
           })
  }
})
})
module.exports = router;