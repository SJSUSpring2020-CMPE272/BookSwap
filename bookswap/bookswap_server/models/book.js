const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var bookSchema = new Schema({
    bookOwnerId: {type: String, required: true},
    bookOwnerName: {type: String, required: true},
    bookOwnerEmail: {type: String, required: true},
    bookName: {type: String, required: true},
    authorName: {type: String, required: false},
    isbnNumber:{type:String,required:false},
    imageUrl:{type:String,required:false},
    bookDescription:{type:String,required:false},
    genre:{type: String, required: true},
    location: {type: JSON, required: false}
},
{
    versionKey: false
});

module.exports = mongoose.model('book', bookSchema);