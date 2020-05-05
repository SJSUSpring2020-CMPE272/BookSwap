const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var usersSchema = new Schema({
    name: {type: String, required: true},
    password: {type: String, required: true},
    emailId:{type:String,required:true},
    address:{type:String,required:true},
    city:{type:String,required:true},
    stateName:{type:String,required:true},
    zipcode:{type:String,required:true},
    country:{type:String,required:false},
    aboutme:{type:String,required:false},
    contactNumber:{type:String,required:false},
    
    image:{type:String,required:false},
   
},
{
    versionKey: false
});

module.exports = mongoose.model('user', usersSchema);