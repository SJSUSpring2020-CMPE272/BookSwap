const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const conversationSchema = require('./conversation');

var messagesSchema = new Schema({
    senderid: {type: String, required: true},
    sname:{type: String, required: true},
    receiverid: {type: String, required: true},
    rname:{type: String},
    conversation:[conversationSchema],
},
{
    versionKey: false
});

module.exports = mongoose.model('message', messagesSchema);