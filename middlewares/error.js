const logger = require("../startup/logging");

module.exports = function (err, req, res, next) {
   logger.error("INTERNAL FATAL ERROR!!", err);

   res.status(500).send("Something failed!!!");
   throw new Error("Internal Error: Something Failed!!", err);
};
