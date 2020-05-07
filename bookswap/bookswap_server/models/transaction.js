const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var transactionSchema = new Schema({
    transactionKey: {type: String, required: true},
    user1: {type: String, required: true},
    book1: {type: String, required: true},
    user2: {type: String, required: true},
    book2: {type: String, required: true},
    state: {type: String, required: true},
    timestamp: {type: String, required: false}
},
{
    versionKey: false
});

module.exports = mongoose.model('transaction', transactionSchema);