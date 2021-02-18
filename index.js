const express = require("express");

const app = express();

// Statup
const { logger } = require("./startup/logging");
console.log(" b4 global imports Logger");
require("./startup/globalImports")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();

// Config PORT
const port = process.env.PORT || 3000;
app.listen(port, () => logger.info(`Listening on port ${port}...  `));
