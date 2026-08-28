const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

const BASE_URL = "http://localhost:5000";

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Username and password are required." });
  }

  if (isValid(username)) {
    users.push({ username: username, password: password });
    return res.status(200).json({ message: "User successfully registered. Now you can login" });
  } else {
    return res.status(404).json({ message: "User already exists!" });
  }
});

// Task 1: Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).send(JSON.stringify(book, null, 4));
  } else {
    return res.status(404).json({ message: `No book found for ISBN ${isbn}` });
  }
});

// Task 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const matchingKeys = Object.keys(books).filter((key) => {
    return books[key].author.toLowerCase() === author.toLowerCase();
  });

  if (matchingKeys.length > 0) {
    let result = {};
    matchingKeys.forEach((key) => {
      result[key] = books[key];
    });
    return res.status(200).send(JSON.stringify(result, null, 4));
  } else {
    return res.status(404).json({ message: `No books found for author ${author}` });
  }
});

// Task 4: Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const matchingKeys = Object.keys(books).filter((key) => {
    return books[key].title.toLowerCase() === title.toLowerCase();
  });

  if (matchingKeys.length > 0) {
    let result = {};
    matchingKeys.forEach((key) => {
      result[key] = books[key];
    });
    return res.status(200).send(JSON.stringify(result, null, 4));
  } else {
    return res.status(404).json({ message: `No books found for title ${title}` });
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  } else {
    return res.status(404).json({ message: `No book found for ISBN ${isbn}` });
  }
});

/* ---------------------------------------------------------------------
   Task 10-13: Same operations implemented using Promises / async-await
   with Axios, as required for general.js grading (Task 11).
   These are exported so they can be used from a client script,
   and are also wired to a few "/async/..." routes below so they
   can be exercised directly if needed.
--------------------------------------------------------------------- */

// Task 10: Get all books using an async/await + Axios call
async function getAllBooksAsync() {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching all books:", error.message);
    throw error;
  }
}

// Task 11: Search by ISBN using Promises
function getBookByISBNPromise(isbn) {
  return axios.get(`${BASE_URL}/isbn/${isbn}`)
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      console.error(`Error fetching book with ISBN ${isbn}:`, error.message);
      throw error;
    });
}

// Task 12: Search by Author using async/await
async function getBooksByAuthorAsync(author) {
  try {
    const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching books by author ${author}:`, error.message);
    throw error;
  }
}

// Task 13: Search by Title using async/await
async function getBooksByTitleAsync(title) {
  try {
    const response = await axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching books by title ${title}:`, error.message);
    throw error;
  }
}

// Optional helper routes to trigger the Axios-based functions over HTTP
public_users.get('/async/books', async function (req, res) {
  try {
    const data = await getAllBooksAsync();
    return res.status(200).send(JSON.stringify(data, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

public_users.get('/async/isbn/:isbn', function (req, res) {
  getBookByISBNPromise(req.params.isbn)
    .then((data) => res.status(200).send(JSON.stringify(data, null, 4)))
    .catch(() => res.status(404).json({ message: "Book not found" }));
});

public_users.get('/async/author/:author', async function (req, res) {
  try {
    const data = await getBooksByAuthorAsync(req.params.author);
    return res.status(200).send(JSON.stringify(data, null, 4));
  } catch (error) {
    return res.status(404).json({ message: "No books found for this author" });
  }
});

public_users.get('/async/title/:title', async function (req, res) {
  try {
    const data = await getBooksByTitleAsync(req.params.title);
    return res.status(200).send(JSON.stringify(data, null, 4));
  } catch (error) {
    return res.status(404).json({ message: "No books found for this title" });
  }
});

module.exports.general = public_users;
module.exports.getAllBooksAsync = getAllBooksAsync;
module.exports.getBookByISBNPromise = getBookByISBNPromise;
module.exports.getBooksByAuthorAsync = getBooksByAuthorAsync;
module.exports.getBooksByTitleAsync = getBooksByTitleAsync;
