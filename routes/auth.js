const Joi = require("joi");
const express = require("express");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");

const router = express.Router();

router.post("/", async (req, res) => {
   const { error } = validate(req.body);
   if (error) return res.status(400).send(error.details[0].message);

   let user = await User.findOne({ email: req.body.email });
   if (!user) return res.status(400).send("Invalid Email or Password");

   const validPassword = await bcrypt.compare(req.body.password, user.password);
   if (!validPassword) return res.status(400).send("Invalid Email or Password");

   const token = user.genereateAuthToken();
   res.send(token);
});

function validate(user) {
   const joiUserSchema = Joi.object({
      email: Joi.string().email().min(5).max(255).required(),
      password: Joi.string().min(4).max(255).required(),
   });

   return joiUserSchema.validate(user);
}

module.exports = router;
