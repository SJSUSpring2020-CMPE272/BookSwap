"use strict";
const mongoose = require('mongoose');
const {mongoDB} = require("../config/dbconfig")
var options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 500,
  bufferMaxEntries: 0
};
mongoose.connect(mongoDB, options, (err, res) => {
  if (err) {
      console.log(err);
      console.log(`MongoDB Connection Failed`);
  } else {
      console.log(`MongoDB Connected`);
  }
});

module.exports = mongoose;