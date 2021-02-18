const express = require("express");

// Routes
const categories = require("../routes/categories");
const userDetails = require("../routes/userDetails");
const users = require("../routes/users");
const auth = require("../routes/auth");
const error = require("../middlewares/error");

module.exports = function (app) {
   // PIPELINE
   app.use(express.json());
   app.use("/api/categories", categories);
   app.use("/api/userDetails", userDetails);
   app.use("/api/users", users);
   app.use("/api/auth", auth);
   app.use(error);
};
