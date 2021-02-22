module.exports = (validator) => {
   return async (req, res, next) => {
      const err = await validator(req);

      if (err)
         return res.status(err.status).send({ errorMessage: err.message });

      next();
   };
};
