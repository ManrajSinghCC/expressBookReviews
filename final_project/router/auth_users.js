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
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
