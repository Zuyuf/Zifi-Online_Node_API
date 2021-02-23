const Joi = require("joi");
const express = require("express");
const bcrypt = require("bcrypt");

const { User } = require("../models/user");
const validate = require("../middlewares/validate");

const router = express.Router();

//

router.post("/", validate(validateUserLogin), async (req, res) => {
   let user = await User.findOne({ email: req.body.email });
   if (!user)
      return res.status(400).send({ message: "Invalid Email or Password" });

   const validPassword = await bcrypt.compare(req.body.password, user.password);
   if (!validPassword)
      return res.status(400).send({ message: "Invalid Email or Password" });

   const token = user.generateAuthToken();
   res.send({ token });
});

function validateUserLogin(user) {
   const joiUserSchema = Joi.object({
      email: Joi.string().email().min(5).max(255).required(),
      password: Joi.string().min(4).max(255).required(),
   });

   return joiUserSchema.validate(user);
}

module.exports = router;
