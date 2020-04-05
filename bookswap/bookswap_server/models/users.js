const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var usersSchema = new Schema({
    name: {type: String, required: true},
    password: {type: String, required: true},
    emailId:{type:String,required:true},
},
{
    versionKey: false
});

module.exports = mongoose.model('user', usersSchema);