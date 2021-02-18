const { logger } = require("./startup/logging");

module.exports = function (err, req, res, next) {
   logger.error("Something failed!!!", err);

   res.status(500).send("Something failed!!!");
   throw new Error("Internal Error: Something Failed!!", err);
};
