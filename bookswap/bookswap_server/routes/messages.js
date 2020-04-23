"use strict"
const app = require("../app");
const express = require("express");
const router = express.Router();
const Messages = require('../models/messages');

router.post("/", async (req, res) => {
console.log("reached messages"+JSON.stringify(req.body))
Messages.findOne({$or:[{$and:[{senderid: req.body.senderid},{receiverid:req.body.receiverid}]},{$and:[{senderid: req.body.receiverid},{receiverid:req.body.senderid}]}]}, (err, message) => {
    if (err) {
      res.status(500).end("Database error")
    }
    if(message)
    {
        var newConversation = {
            sname:req.body.sname,
            sid:req.body.senderid,
            rname:req.body.receivername,
            rid:req.body.receiverid,
            content:req.body.content,
            timestamp:new Date().toISOString()
            }
          message.conversation.push(newConversation);
          message.save((err, updatedMessage) => {
            if (err) {
                console.log(err);
            
            res.status(500).end("Error in data")
            }
            if (updatedMessage) {
              const payload={successFlag:"true"};
                  res.status(200).end(JSON.stringify(payload))
            }
           
          });
    }
    else {

        var newMessage= new Messages({
            senderid:req.body.senderid,
            sname:req.body.sname,
            receiverid: req.body.receiverid,
            rname:req.body.receivername,
          });
          var newConversation = {
            sname:req.body.sname,
            sid:req.body.senderid,
            rname:req.body.receivername,
            rid:req.body.receiverid,
            content:req.body.content,
            timestamp:new Date().toISOString()
            }
            newMessage.conversation.push(newConversation);
          newMessage.save((err, data) => {
            if (err) {
                console.log(err);
              res.status(500).end("Database error")
            }
            else {
              res.status(200).end("Message successfully sent")
            }
          });   
          
    }     
})
})

router.post("/getAllReceiver", async (req, res) => {
    var allchats_receiver;
    
    Messages.find({senderid: req.body.userid}, async (err, messages) => {
        if (err) {
         
          res.status(500).end("Database Error")
        }
        
        else {
           
            allchats_receiver=messages.map(message=>{const receiver={};
            receiver.id=message.receiverid;
            receiver.name=message.rname;
            receiver.type=message.receiverUserType;
            return receiver;
            })
            console.log("here"+JSON.stringify(allchats_receiver))
            res.status(200).end(JSON.stringify(allchats_receiver))
            
        }
        
    })
})

router.post("/getAllSender", async (req, res) => {
    var allchats_sender;
    Messages.find({receiverid: req.body.userid}, async (err, messages) => {
        if (err) {
          res.status(500).end("Database error")
        }
        
        else {
           
            allchats_sender=messages.map(message=>{const sender={};
            sender.id=message.senderid;
            sender.name=message.sname;
            sender.type=message.senderUserType;
            return sender;
            })
            console.log("here sender"+JSON.stringify(allchats_sender))
            res.status(200).end(JSON.stringify(allchats_sender))
            }
            
      });
})

router.post("/getAllMessages", async (req, res) => {

Messages.findOne({$or:[{$and:[{senderid: req.body.userId_1},{receiverid:req.body.userId_2}]},{$and:[{senderid: req.body.userId_2},{receiverid:req.body.userId_1}]}]}, (err, message) => {
    if (err) {
      
      res.status(500).end("Database Error")
    }
    else
         {
                  res.status(200).end(JSON.stringify(message));
            }
           
          });
        })
  
module.exports = router;