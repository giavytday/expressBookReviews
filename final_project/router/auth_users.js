const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username, password) => {
    // Check if username and password match the ones in our records
    let validusers = users.filter((user) => {
      return (user.username === username && user.password === password);
    });
    return validusers.length > 0;
  }

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken, username
      }
      return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
  });

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let review = req.query.review;
    let username = req.session.authorization['username'];
  
    // 1. Check if the book exists in our library
    if (books[isbn]) {
        let book = books[isbn];
        
        // 2. Add or Update the review
        // If 'username' already exists, it overwrites. If not, it creates a new entry.
        book.reviews[username] = review;
        
        return res.status(200).send(`The review for the book with ISBN ${isbn} has been added/updated.`);
    } else {
        return res.status(404).json({message: `Book with ISBN ${isbn} not found`});
    }
  });

  // Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization['username'];
  
    if (books[isbn]) {
        let book = books[isbn];
        if (book.reviews[username]) {
            delete book.reviews[username];
            return res.status(200).send(`Review for ISBN ${isbn} by user ${username} deleted.`);
        } else {
            return res.status(404).send("Review not found for this user.");
        }
    } else {
      return res.status(404).json({message: "Book not found"});
    }
  });
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
