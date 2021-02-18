const mongoose = require("mongoose");

module.exports = function () {
   // CONNECT to MongoDB
   mongoose
      .connect("mongodb://localhost/zifi", {
         useNewUrlParser: true,
         useFindAndModify: false,
      })
      .then(() => console.log("Connected to MongoDB..."));
   // .catch((ex) => console.error("Couldn't connect to MongoDB!!"));
};
