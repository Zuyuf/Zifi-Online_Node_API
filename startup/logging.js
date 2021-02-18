const { createLogger, format, transports } = require("winston");
require("express-async-errors");

let logger = createLogger({
   level: "info",
   format: format.combine(
      format.timestamp({
         format: "YYYY-MM-DD HH:mm:ss",
      }),
      format.errors({ stack: true }),
      format.splat(),
      format.json()
   ),
   transports: [
      new transports.File({ level: "error", filename: "../logs/error.log" }),
      new transports.File({ level: "info", filename: "../logs/info.log" }),
   ],
   exceptionHandlers: [
      new transports.File({
         level: "error",
         filename: "../logs/exceptions.log",
      }),
   ],
   rejectionHandlers: [
      new transports.File({
         level: "error",
         filename: "../logs/rejections.log",
      }),
   ],
   exitOnError: true,
});

if (process.env.NODE_ENV !== "production") {
   logger.add(
      new transports.Console({
         format: format.combine(
            format.colorize(),
            format.prettyPrint(),
            format.simple()
         ),
      })
   );

   logger.exceptions.handle(
      new transports.Console({
         format: format.combine(
            format.colorize(),
            format.prettyPrint(),
            format.simple()
         ),
      })
   );

   logger.rejections.handle(
      new transports.Console({
         format: format.combine(
            format.colorize(),
            format.prettyPrint(),
            format.simple()
         ),
      })
   );
}

exports.logger = logger;

//
//
//
// function () {
//    // caughts an Exception if its not been Caught
//    process.on("uncaughtException", (ex) => {
//       console.log(">>>     GOT AN UNCAUGHT EXCEPTION...   ", ex);
//       process.exit(1);
//    });

//    process.on("unhandledRjection", (ex) => {
//       console.log(">>>     GOT AN UNHANDLED REJECTION...   ", ex);
//       process.exit(1);
//    });
// };
