const express = require("express");
const mongoose = require("mongoose");
const categories = require("./routes/categories");

const app = express();

mongoose
   .connect("mongodb://localhost/zifi")
   .then(() => console.log("Connected to MongoDB..."))
   .catch((ex) => console.error("Couldn't connect to MongoDB!!"));

app.use(express.json());
app.use("/api/categories", categories);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
