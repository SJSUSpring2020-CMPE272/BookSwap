const app = require("../app");
const express = require("express");
const router = express.Router();
const Requests = require('../models/request');

router.post("/addrequest", async (req, res) => {

    let imageUrl;
    if (req.body.isbnNumber.length == 10 || req.body.isbnNumber.length == 13) {
        imageUrl = "http://covers.openlibrary.org/b/isbn/" + req.body.isbnNumber + "-L.jpg"
    }

    var newRequest = new Requests({
        senderid: req.body.senderid,
        sname: req.body.sname,
        receiverid: req.body.receiverid,
        rname: req.body.rname,
        requeststatus: req.body.requeststatus,
        bookName: req.body.bookName,
        authorName: req.body.authorName,
        isbnNumber: req.body.isbnNumber,
        bookDescription: req.body.description,
        imageUrl: imageUrl,
        genre: req.body.genre,
        requestTimeStamp: new Date(),
    });


    newRequest.save((err, data) => {
        if (err) {
            console.log(err)
            res.status(500).end("Error in data");
        }
        else {
            res.status(200).end("Book added");
        }
    });
})


router.post("/getrequests", async (req, res) => {

    Requests.find({ receiverid: req.body.userid, requeststatus:'In Progress' }, async (err, requests) => {
        if (err) {

            res.status(500).end("Database Error")
        }

        else {

            res.status(200).end(JSON.stringify(requests))

        }

    })
})

router.post("/updaterequest", async (req, response) => {

    var myquery = { receiverid: req.body.userid,  senderid: req.body.senderid, bookName: req.body.bookName, requeststatus:'In Progress'};
    var newvalues = { $set: {requeststatus: req.body.status} };
    Requests.updateOne(myquery, newvalues, function(err, res) {
        if (err){
            throw err;
        }
        else{
            response.status(200).end("updated");
        }

      });
})


router.post("/getswaphistory", async (req, res) => {
    var allchats_receiver;

    Requests.find({ senderid: req.body.userid, requeststatus:'Accepted' }, async (err, requests) => {
        if (err) {

            res.status(500).end("Database Error")
        }

        else {

            res.status(200).end(JSON.stringify(requests))

        }

    })
})


router.post("/swapcheck", async (req, res) => {

    Requests.find({ senderid: req.body.userid}, async (err, requests) => {
        if (err) {

            res.status(500).end("Database Error")
        }

        else {

            res.status(200).end(JSON.stringify(requests))

        }

    })
})

module.exports = router;