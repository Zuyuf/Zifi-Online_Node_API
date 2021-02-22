const express = require("express");

// Routes
const categories = require("../routes/categories");
const userDetails = require("../routes/userDetails");
const userDetailsAddresses = require("../routes/userDetails/addresses");
const userDetailsCards = require("../routes/userDetails/cards");
const users = require("../routes/users");
const auth = require("../routes/auth");
const error = require("../middlewares/error");

module.exports = function (app) {
   // PIPELINE
   app.use(express.json());
   app.use("/api/categories", categories);
   app.use("/api/userDetails", userDetails);
   app.use("/api/userDetails/addresses", userDetailsAddresses);
   app.use("/api/userDetails/cards", userDetailsCards);
   app.use("/api/users", users);
   app.use("/api/auth", auth);
   app.use(error);
};
