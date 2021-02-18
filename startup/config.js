const config = require("config");

module.exports = function () {
   // ImMPORTANT Config Variables
   if (!config.get("jwtPrivateKey")) {
      throw new Error("FATAL ERROR: jwtPrivateKey is Not Defined!!!");
   }
};
