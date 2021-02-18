module.exports = function (err, req, res, next) {
   // Log exceeption
   res.status(500).send("Something failed!!!");
   console.log(err);
};
