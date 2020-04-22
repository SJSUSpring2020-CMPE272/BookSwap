const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var usersSchema = new Schema({
    name: {type: String, required: true},
    password: {type: String, required: true},
    emailId:{type:String,required:true},
    aboutme:{type:String,required:false},
    contactNumber:{type:String,required:false},
    city:{type:String,required:false},
    state:{type:String,required:false},
    country:{type:String,required:false},
    image:{type:String,required:false},
   
},
{
    versionKey: false
});

module.exports = mongoose.model('user', usersSchema);