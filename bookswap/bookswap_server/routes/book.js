"use strict"
const app = require("../app");
const express = require("express");
const router = express.Router();
const Users = require('../models/users');
const Books = require('../models/book');
var userLat;
var userLon;
var range;

      
      // filtering by distance
       function distance(lat1, lon1, lat2, lon2){
        console.log("distance called on "+lat1+","+lon1+","+lat2+","+lon2+",");
        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
         }
        else {
            var radlat1 = Math.PI * lat1/180;
            var radlat2 = Math.PI * lat2/180;
            var theta = lon1-lon2;
            console.log();
            var radtheta = Math.PI * theta/180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180/Math.PI;
            dist = dist * 60 * 1.1515;
            return dist;
        }
      }
      
      function filterByDistance(book){
       let dist=0;
       console.log("range captured:"+range );
       console.log("filter by dist called on book" +book.bookName);
      
         dist=distance(userLat, userLon , book.location.latitude,book.location.longitude );
                               console.log("distance of book:"+book.bookName+":" + dist);
                               return dist<= range;
       
      
        
      }
      
      
      // filtering by distance




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
    genre:req.body.category,
    location:req.body.location
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
  
  userLat=req.body.userLat;
  userLon=req.body.userLon;
  range=req.body.range;
  let distanceFilteredBooks=books.filter(filterByDistance);
 books= distanceFilteredBooks ;
let filteredBooks = books.filter(book => book.bookOwnerId!=req.body.userId);
// console.log("BEFORE " + JSON.stringify(filteredBooks));
filteredBooks = sortBooksbasedOnGenres(filteredBooks, req.body["sortedOreder"]);
// console.log("AFTER " + JSON.stringify(filteredBooks));
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
    
    userLat=req.body.userLat;
    userLon=req.body.userLon;
    range=req.body.range;
    let distanceFilteredBooks=books.filter(filterByDistance);
   books= distanceFilteredBooks ;
    const startIndex=(req.body.pageIndex-1)*5;
    const endIndex=req.body.pageIndex*5;
  let filteredBooks = books.filter(book => book.bookOwnerId!=req.body.userId);
  // console.log("BEFORE " + JSON.stringify(filteredBooks));
  filteredBooks = sortBooksbasedOnGenres(filteredBooks, req.body["sortedOreder"]);
  // console.log("AFTER " + JSON.stringify(filteredBooks));
  filteredBooks = filteredBooks.slice(startIndex,endIndex);
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
    
    userLat=req.body.userLat;
    userLon=req.body.userLon;
    range=req.body.range;
    let distanceFilteredBooks=books.filter(filterByDistance);
   books= distanceFilteredBooks ;
     let filteredBooks;
     console.log("SEARCH"+req.body.searchString)
    const startIndex=(req.body.pageIndex-1)*5;
    const endIndex=req.body.pageIndex*5;
    filteredBooks = books.filter(book => book.bookOwnerId!=req.body.userId && (book.bookName.toLowerCase().includes(req.body.searchString.toLowerCase())||book.genre.toLowerCase().includes(req.body.searchString.toLowerCase())||book.authorName.toLowerCase().includes(req.body.searchString.toLowerCase())));
    // console.log("BEFORE " + JSON.stringify(filteredBooks));
    filteredBooks = sortBooksbasedOnGenres(filteredBooks, req.body["sortedOreder"]);
    filteredBooks = filteredBooks.slice(startIndex,endIndex);
    // console.log("AFTER " + JSON.stringify(filteredBooks));
  let payload = JSON.stringify(filteredBooks);
  res.status(200).end(payload);   
             }
  })


}
  })

  router.get("/getAvailableBook", async (req, res) => {
    
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
      
      userLat=req.body.userLat;
      userLon=req.body.userLon;
      range=req.body.range;
      let distanceFilteredBooks=books.filter(filterByDistance);
     books= distanceFilteredBooks ;
    let payload = JSON.stringify(books);
    res.status(200).end(payload);   
               }
    }).limit(3)
    })

    router.post("/removeSwapBook", async (req, res) => {
    console.log("reached remove"+JSON.stringify(req.body))
      Books.findByIdAndDelete(req.body.bookId, (err)=>{

        if(err)
        {
          res.status = 500;
          res.message = "Database Error";
         console.log("reached error"+err)
        }
        
          //console.log(successFlag)
        res.status = 200;
        res.message = "Deleted Book";
        
      })
  })

function sortBooksbasedOnGenres(booksJson, genreOrder) {
    var result = []

    genreOrder.forEach(genre => {
      booksJson.forEach(bookJson => {
        if(bookJson["genre"] === genre) {
          result.push(bookJson);
        }
      });
    });

    booksJson.forEach(bookJson => {
      if(!result.includes(bookJson)) {
        result.push(bookJson);
      }
    });

    return result;
}
module.exports = router;
