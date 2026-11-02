const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid; // From auth_users.js file 
let users = require("./auth_users.js").users; // From auth_users.js file
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  //Error 1 : something missing
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Error 2: name already taken.
  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists!" });
  }
   // All good: add the user
  users.push({ username: username, password: password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
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
  const isbn = req.params.isbn; //number from the URL 
  const book = books[isbn]; 

  if (book) {
    return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  }
  return res.status(404).json({ message: "Book not found" });
});

// Task 10: Get all books using async-await with Axios.
public_users.get('/async/books', async function (req, res) {
  try {
    const response = await axios.get("http://localhost:5000/");
    return res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book list", error: error.message });
  }
});
module.exports.general = public_users;
