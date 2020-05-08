const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var conversationSchema = new Schema({
    sname:{type:String,required:true},
    sid:{type:String,required:true},
    rname:{type:String,required:true},
    rid:{type:String,required:true},
    content:{type:String,required:true},
    timestamp:{type:String,required:true}
},
{
    versionKey: false
});

module.exports = conversationSchema;