const mongoose = require("mongoose");
const config = require("config");

module.exports = function () {
   // CONNECT to MongoDB
   const db_string = config.get("db");

   mongoose
      .connect(db_string, {
         useNewUrlParser: true,
         useFindAndModify: false,
         useUnifiedTopology: true,
      })
      .then(() => console.log(`Connected to MongoDB :  ${db_string}  `));
   // .catch((ex) => console.error("Couldn't connect to MongoDB!!"));
};
