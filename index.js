const express = require("express");
const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const app = express();

const categories = require("./routes/categories");
const userDetails = require("./routes/userDetails");
const users = require("./routes/users");

// CONNECT to MongoDB
mongoose
   .connect("mongodb://localhost/zifi", {
      useNewUrlParser: true,
      useFindAndModify: false,
   })
   .then(() => console.log("Connected to MongoDB..."))
   .catch((ex) => console.error("Couldn't connect to MongoDB!!"));

// PIPELINE
app.use(express.json());
app.use("/api/categories", categories);
app.use("/api/userDetails", userDetails);
app.use("/api/users", users);

// Config PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
