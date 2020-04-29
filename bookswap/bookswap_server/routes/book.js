"use strict"
const app = require("../app");
const express = require("express");
const router = express.Router();
const Users = require('../models/users');
const Books = require('../models/book');

router.post("/addSwapBook", async (req, res) => {
console.log("reached profile"+JSON.stringify(req.body))
let imageUrl;
if(req.body.isbnNumber.length==10||req.body.isbnNumber.length==13)
{
  imageUrl="http://covers.openlibrary.org/b/isbn/"+req.body.isbnNumber+"-L.jpg"
}
  
var newBook = new Books({
    bookOwnerId: req.body.bookOwnerId,
    bookOwnerName: req.body.bookOwnerName,
    bookOwnerEmail: req.body.bookOwnerEmail,
    bookName: req.body.bookName,
    authorName: req.body.authorName,
    isbnNumber:req.body.isbnNumber,
    bookDescription:req.body.description,
    imageUrl:imageUrl,
    genre:req.body.category
});
    
  
newBook.save((err, data) => {
    if (err) {
      console.log(err)
      res.status(500).end("Error in data");
    }
    else {
      res.status(200).end("Book added");
    }
  });
})
  router.post("/getSwapBook", async (req, res) => {
    console.log("reached get swap book"+JSON.stringify(req.body))
  Books.find({ bookOwnerId: req.body.bookOwnerId}, (err, book) => {
    if (err) {
     res.status = 500;
      res.message = "Database Error";
   }
   if (!book) {
     res.status = 401;
     res.message = "No such book exists";
   }
   else {
   
 let payload = JSON.stringify(book);
 res.status(200).end(payload);
       
          
             }
           
  
})
})
router.post("/getSwapBookAllUsers", async (req, res) => {
console.log("reached get all swap book"+JSON.stringify(req.body))
Books.find({}, (err, books) => {
  if (err) {
   res.status = 500;
    res.message = "Database Error";
 }
 if (!books) {
   res.status = 401;
   res.message = "No such book exists";
 }
 else {
let filteredBooks = books.filter(book => book.bookOwnerId!=req.body.userId)
console.log(JSON.stringify(filteredBooks))
let payload = JSON.stringify(filteredBooks);
res.status(200).end(payload);   
           }
})
})
router.post("/searchBook", async (req, res) => {
  console.log("reached search book"+JSON.stringify(req.body))
  if(req.body.searchString=='')
  {
  Books.find({}, (err, books) => {
    if (err) {
     res.status = 500;
      res.message = "Database Error";
   }
   if (!books) {
     res.status = 401;
     res.message = "No such book exists";
   }
   else {
    const startIndex=(req.body.pageIndex-1)*5;
    const endIndex=req.body.pageIndex*5;
  let filteredBooks = books.filter(book => book.bookOwnerId!=req.body.userId).slice(startIndex,endIndex);
  console.log(JSON.stringify(filteredBooks))
  let payload = JSON.stringify(filteredBooks);
  res.status(200).end(payload);   
             }
  })
}
else{
  Books.find({}, (err, books) => {
    if (err) {
     res.status = 500;
      res.message = "Database Error";
   }
   if (!books) {
     res.status = 401;
     res.message = "No such book exists";
   }
   else {
     let filteredBooks;
     console.log("SEARCH"+req.body.searchString)
    const startIndex=(req.body.pageIndex-1)*5;
    const endIndex=req.body.pageIndex*5;
  filteredBooks = books.filter(book => book.bookOwnerId!=req.body.userId && (book.bookName.toLowerCase().includes(req.body.searchString.toLowerCase())||book.authorName.toLowerCase().includes(req.body.searchString.toLowerCase()))).slice(startIndex,endIndex);
  let payload = JSON.stringify(filteredBooks);
  res.status(200).end(payload);   
             }
  })


}
  })
module.exports = router;