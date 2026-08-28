const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const SECRET_KEY = "fingerprint_customer";

const isValid = (username) => {
  // returns false if username already exists in users
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length === 0;
};

const authenticatedUser = (username, password) => {
  // returns true if username and password match a registered user
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  return validusers.length > 0;
};

// only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in. Username and password are required." });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, SECRET_KEY, { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add or modify a book review (Task 8 - authenticated)
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization ? req.session.authorization.username : null;

  if (!username) {
    return res.status(401).json({ message: "User not logged in" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review text is required as a query parameter" });
  }

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: `No book found for ISBN ${isbn}` });
  }

  book.reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully",
    reviews: book.reviews
  });
});

// Delete a book review (Task 9 - authenticated)
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization ? req.session.authorization.username : null;

  if (!username) {
    return res.status(401).json({ message: "User not logged in" });
  }

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: `No book found for ISBN ${isbn}` });
  }

  if (book.reviews[username] === undefined) {
    return res.status(404).json({ message: `No review by user ${username} found for ISBN ${isbn}` });
  }

  delete book.reviews[username];

  return res.status(200).json({
    message: "Review deleted successfully",
    reviews: book.reviews
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
