const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const app = express();

const categories = require("./routes/categories");
const userDetails = require("./routes/userDetails");
const users = require("./routes/users");
const auth = require("./routes/auth");

// ImMPORTANT Config Variables
if (!config.get("jwtPrivateKey")) {
   console.error("FATAL ERROR: jwtPrivateKey is Not Defined!!!");
   process.exit(1);
}

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
app.use("/api/auth", auth);

// Config PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
