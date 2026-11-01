const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid; // From auth_users.js file 
let users = require("./auth_users.js").users; // From auth_users.js file
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn; // Number from the URL 
  const book = books[isbn]; // looking at that book number up

  if (book) {
    return res.status(200).send(JSON.stringify(book, null, 4));
  }
  return res.status(404).json({ message: "Book not found!" });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const isbnskey = Object.keys(books); // Returns an array ["1", "2", "3".....,"10"]
  const matches = {};

  // Go through every book and keep the ones by this author. 
  isbnskey.forEach((isbn) => {
    if (books[isbn].author === author) {
      matches[isbn] = books[isbn];
    }
  });

  // Checker 
  if (Object.keys(matches).length > 0) {
    return res.status(200).send(JSON.stringify(matches, null, 4));
  }
  return res.status(404).json({ message: "No books found by this author" });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const titlekey = Object.keys(books); // titlekey returns ["1", "2", "3", "4", ....... , "10"]
  const matches = {};

  titlekey.forEach((isbn) => {
    if (books[isbn].title === title) {
      matches[isbn] = books[isbn];
    }
  });

  // Checker
  if (Object.keys(matches).length > 0) {
    return res.status(200).send(JSON.stringify(matches, null, 4));
  }
  return res.status(404).json({message: "No books found by this title name" });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
