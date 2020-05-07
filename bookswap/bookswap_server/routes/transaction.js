"use strict"
const app = require("../app");
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const { secret } = require('../config/config');
const Transaction = require('../models/transaction');

router.post("/", async (req, res) => {
console.log("reached add transaction"+JSON.stringify(req.body))
  
var transaction = new Transaction({
    transactionKey: req.body.transactionKey,
    user1: req.body.user1,
    book1: req.body.book1,
    user2: req.body.user2,
    book2: req.body.book2,
    state: req.body.state,
    timestamp: req.body.timestamp
});

transaction.save((err, data) => {
    if (err) {
      console.log(err)
      res.status(500).end("Error in data");
    }
    else {
      res.status(200).end("Transaction added");
    }
  });
})


//TODO(Raaga): getTransactions

router.post("/getTransactions", async (req, res) => {
    console.log("reached get transactions"+JSON.stringify(req.body))
  Transaction.find({ bookOwnerId: req.body.bookOwnerId}, (err, book) => {
    if (err) {
     res.status = 500;
      res.message = "Database Error";
   }
   if (!book) {
     res.status = 401;
     res.message = "No such book exists";
   }
   else {
   
 let payload = JSON.stringify(book);
 res.status(200).end(payload);
       
          
             }
           
  
})
})

module.exports = router;