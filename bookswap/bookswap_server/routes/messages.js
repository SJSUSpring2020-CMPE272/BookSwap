"use strict"
const app = require("../app");
const express = require("express");
const router = express.Router();
const Users = require('../models/users');
const Books = require('../models/book');

router.post("/", async (req, res) => {
console.log("reached messages"+JSON.stringify(req.body))
  

 
})
  
module.exports = router;