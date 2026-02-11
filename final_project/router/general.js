const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  // 1. Retrieve the ISBN from the request URL
  const isbn = req.params.isbn;
  
  // 2. Find the book in our local 'books' database
  // (We use the ISBN as the key to find the specific book object)
  const book = books[isbn];

  // 3. Send the book details back to the user
  if (book) {
      return res.status(200).json(book);
  } else {
      return res.status(404).json({message: "Book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const book_keys = Object.keys(books); // Get all the ISBNs (keys)
    const booksByAuthor = []; // Create an array to hold matches
  
    // Iterate through the books to find the author
    for (let key of book_keys) {
        if (books[key].author === author) {
            booksByAuthor.push(books[key]);
        }
    }
  
    // Send the results
    if (booksByAuthor.length > 0) {
        return res.status(200).json(booksByAuthor);
    } else {
        return res.status(404).json({message: "Book not found"});
    }
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const book_keys = Object.keys(books); // Get all the ISBNs (keys)
    const booksByTitle = []; //Create an array to hold matches

    for (let key of book_keys) {
        if (books [key].title === title) {
            booksByTitle.push(books[key]);
        }
    }
    //Send the results 
    if (booksByTitle.length > 0) {
        return res.status(200).json(booksByTitle);
    } else {
        return res.status(404).json({message: "Book not found"});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({message: "Book not found"});
    }
  });

module.exports.general = public_users;
