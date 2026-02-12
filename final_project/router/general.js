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

// Get the book list available in the shop using Async-Await
public_users.get('/', async function (req, res) {
    try {
      // 1. We "await" the messenger (Axios) to finish its job
      const getBooks = () => {
          return new Promise((resolve, reject) => {
              resolve(books);
          });
      }
      
      const list = await getBooks();
      res.status(200).send(JSON.stringify(list, null, 4));
  
    } catch (error) {
      res.status(500).json({message: "Error fetching book list"});
    }
  });

// Get book details based on ISBN using Async-Await
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn; // 1. Get the ISBN from the URL
  
    try {
      // 2. Create a Promise to "wait" for the book search
      const getBook = new Promise((resolve, reject) => {
        if (books[isbn]) {
          resolve(books[isbn]); // Success: We found the book!
        } else {
          reject("Book not found"); // Error: That ISBN doesn't exist
        }
      });
  
      // 3. Wait for the search to finish
      const book = await getBook;
      res.status(200).send(JSON.stringify(book, null, 4));
  
    } catch (error) {
      // 4. If the book wasn't found, send a 404 error
      res.status(404).json({message: error});
    }
  });
  
// Task 12: Get book details based on Author using Async-Await
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author; // 1. Get the author name from the URL
  
    try {
      // 2. Create a Promise to "wait" for the search to finish
      const getBooksByAuthor = new Promise((resolve, reject) => {
        // Look through all books and keep only the ones that match the author
        let filtered_books = Object.values(books).filter((book) => book.author === author);
        
        if (filtered_books.length > 0) {
          resolve(filtered_books); // Success: We found books!
        } else {
          reject("No books found by this author"); // Error: No matches
        }
      });
  
      // 3. Wait for the search to complete
      const result = await getBooksByAuthor;
      res.status(200).send(JSON.stringify(result, null, 4));
  
    } catch (error) {
      // 4. Handle the error if no books were found
      res.status(404).json({message: error});
    }
  });

// Get book details based on Title using Async-Await
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title; // 1. Get the title from the URL
  
    try {
      // 2. Create a Promise to "wait" for the search
      const getBooksByTitle = new Promise((resolve, reject) => {
        // Filter the books to find all that match the title
        let filtered_books = Object.values(books).filter((book) => book.title === title);
        
        if (filtered_books.length > 0) {
          resolve(filtered_books); // Success: Found matches!
        } else {
          reject("No books found with this title"); // Error: No matches
        }
      });
  
      // 3. Wait for the Promise to finish
      const result = await getBooksByTitle;
      res.status(200).send(JSON.stringify(result, null, 4));
  
    } catch (error) {
      // 4. If no books were found, send the error message
      res.status(404).json({message: error});
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
