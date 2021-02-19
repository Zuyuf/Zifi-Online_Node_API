const Joi = require("joi");
const express = require("express");

const app = express();

// Statup
let logger = require("./startup/logging");
require("./startup/globalImports")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();

// Config PORT
const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
   logger.info(`Listening on port ${port}...  `)
);

module.exports = server;
