const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    let userswithsamename = users.filter(
        (user) => user.username === username
    );

    return userswithsamename.length > 0;
}

const authenticatedUser = (username, password) => {

    console.log(users);

    let validusers = users.filter(
        (user) =>
            user.username === username &&
            user.password === password
    );

    console.log(validusers);

    return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({
            message: "Error logging in"
        });
    }

    if (authenticatedUser(username, password)) {

        let accessToken = jwt.sign(
            {
                data: password
            },
            'access',
            { expiresIn: 60 * 60 }
        );

        req.session.authorization = {
            accessToken,
            username
        };

        return res.status(300).send(
            "Customer successfully logged in."
        );
    }

    return res.status(300).json({
        message: "Invalid Login. Check username and password"
    });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

const isbn = req.params.isbn;
const review = req.query.review;

const username = req.session.authorization ? req.session.authorization.username : req.session.username;

// On cherche le livre. Dans ce projet, 'books' est généralement un objet indexé par l'ISBN
let book = books[isbn]; 

if (book) {
  // Si l'objet 'reviews' n'existe pas encore pour ce livre, on le crée
  if (!book.reviews) {
    book.reviews = {};
  }
  
  // C'est ici que la magie opère : 
  // Si l'utilisateur n'a pas encore de critique, cela l'ajoute.
  // Si l'utilisateur a déjà une critique, cela écrase l'ancienne (modification).
  book.reviews[username] = review;

  return res.status(200).json({ message: "La critique a été ajoutée/mise à jour avec succès." });
} else {
  return res.status(404).json({ message: "Livre non trouvé." });
}


    



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
