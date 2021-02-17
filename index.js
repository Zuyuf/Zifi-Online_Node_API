const express = require("express");
const mongoose = require("mongoose");

const categories = require("./routes/categories");

const app = express();

app.listen(3000, () => {
   Norm("Listening on 3000");
});
