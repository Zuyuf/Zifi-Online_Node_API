const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
   },

   email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true,
   },

   password: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 1024,
   },

   isAdmin: {
      type: Boolean,
      default: false,
   },

   userDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserDetail",
   },
});

userSchema.methods.generateAuthToken = function () {
   const token = jwt.sign(
      { _id: this._id, isAdmin: this.isAdmin },
      config.get("jwtPrivateKey")
   );
   return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
   const joiUserSchema = Joi.object({
      name: Joi.string().min(5).max(50).required(),
      email: Joi.string().email().min(5).max(255).required(),
      password: Joi.string().min(4).max(255).required(),
      isAdmin: Joi.boolean(),
      userDetails: Joi.objectId(),
   });

   return joiUserSchema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;
