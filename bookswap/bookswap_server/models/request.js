const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var requestsSchema = new Schema({
    senderid: {type: String, required: true},
    sname:{type: String, required: true},
    receiverid: {type: String, required: true},
    rname:{type: String, required: true},
    requeststatus:{type: String},
    bookName: {type: String, required: true},
    authorName: {type: String, required: false},
    isbnNumber:{type:String,required:false},
    imageUrl:{type:String,required:false},
    bookDescription:{type:String,required:false},
    genre:{type: String, required: false},
    requestTimeStamp:{type: Date, required: false},

},
{
    versionKey: false
});

module.exports = mongoose.model('request', requestsSchema);