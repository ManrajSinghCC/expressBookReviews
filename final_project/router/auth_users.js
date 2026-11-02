const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []; // For example: users = [{"username": "John", "password": "pwd123"}, {}, {}]

// Checking to see if username is the same while registrating
const isValid = (username)=>{ //returns boolean
  // Filter the users array for any user with the same username. 
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  })
  if (userswithsamename.length > 0) {
    return true; // User exists
  } else {
    return false; // User does not exist
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  // Filter the users array for any user with the same username and password.
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });

  // Returns true if any valid user is found, otherwise false.
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Error 1 : something missing.
  if (!username || !password ) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Error 2: wrong username or password  
  if (!authenticatedUser(username, password)){
    return res.status(401).json({ message: "Invalid login. Check username and password" });
  }

  // All good : make the ticket and store it in the session.
  let accessToken = jwt.sign({ data: username }, 'access', { expiresIn: 60*60 });

  req.session.authorization = { accessToken, username };
  return res.status(200).json( {message: "User successfully logged in"} );
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review; // the review text, from ?review=...
  const username = req.session.authorization.username; // Who's logged in from the session
  const book = books[isbn]; 

  // Error 1 : No such book
  if (!book) {
    return res.status(404).json({ message: "Book not found!" });
  }

  // Error 2 : no review text sent 
  if (!review) {
    return res.status(400).json({ message: "Review text is required!" });
  }

  // Was there already a review from this user? (only to pick the right message)
  const alreadyReviewed = book.reviews[username] !== undefined; // Returns a Boolean either a TRUE or FALSE.

  // Add or modify: one line does both.
  book.reviews[username] = review;

  return res.status(200).json({
    message: alreadyReviewed
    ? `Review for ISBN ${isbn} modified by ${username}`
    : `Review for ISBN ${isbn} added by ${username}`,
    reviews: book.reviews
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
