"use strict"
const app = require("../app");
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const { secret } = require('../config/config');

//-- Define radius function
if (typeof (Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function () {
        return this * Math.PI / 180;
    }
}

//-- Define degrees function
if (typeof (Number.prototype.toDeg) === "undefined") {
    Number.prototype.toDeg = function () {
        return this * (180 / Math.PI);
    }
}

router.post("/", async (req, res) => {
console.log("reached add latlong"+JSON.stringify(req.body))

var payload = req.body;

var lat1 = parseFloat(payload.lat1);
var lat2 = parseFloat(payload.lat2);
var lng1 = parseFloat(payload.long1);
var lng2 = parseFloat(payload.long2);

//-- Longitude difference
    var dLng = (lng2 - lng1).toRad();

    //-- Convert to radians
    lat1 = lat1.toRad();
    lat2 = lat2.toRad();
    lng1 = lng1.toRad();

    var bX = Math.cos(lat2) * Math.cos(dLng);
    var bY = Math.cos(lat2) * Math.sin(dLng);
    var lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + bX) * (Math.cos(lat1) + bX) + bY * bY));
    var lng3 = lng1 + Math.atan2(bY, Math.cos(lat1) + bX);


    var https = require('follow-redirects').https;
    var fs = require('fs');

    var options = {
      'method': 'GET',
      'hostname': 'api.yelp.com',
      'path': '/v3/businesses/search?term=starbucks&latitude=' + lat3.toDeg() +'&longitude=' + lng3.toDeg() + '&radius=4828',
      'headers': {
        'Authorization': 'Bearer d3WAXc8JyiQ2mEQZJT6f3XQT3W8GzeNtBPiKuVHPtV8hv9ffDGixBB0i_l-yAKaRRd_MKdoPkzWC2HmTGH2NiiPe304zXzWdXbv7nfRKgRONAiU8zHJY2T0ppEUIWXYx',
        'Cookie': '__cfduid=d9c0e02eb591bd9a1a5efd457c08f71861588934698'
      },
      'maxRedirects': 20
    };

    var req = https.request(options, function (res1) {
      var chunks = [];

      res1.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res1.on("end", function (chunk) {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
        res.status(200).end(body);
      });

      res1.on("error", function (error) {
        console.error(error);
      });
    });

    req.end();
})

module.exports = router;