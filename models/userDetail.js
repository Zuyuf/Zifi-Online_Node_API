const Joi = require("joi");
const mongoose = require("mongoose");

const address = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
   },

   line1: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 100,
   },

   line2: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 100,
   },

   pincode: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 10,
   },
});

const card = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
   },

   cardNumber: {
      type: String,
      minlength: 8,
      maxlength: 30,
   },
});

const userDetailSchema = new mongoose.Schema({
   user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
   },

   firstName: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
   },

   lastName: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
   },

   addresses: {
      type: [address],
      required: true,
   },

   homePhone: {
      type: Number,
      required: true,
      minlength: 5,
      maxlength: 20,
   },

   workPhone: {
      type: Number,
      minlength: 5,
      maxlength: 20,
   },

   cards: {
      type: [card],
      required: true,
   },
});

const UserDetail = mongoose.model("UserDetail", userDetailSchema);

function validateUserDetail(details) {
   const joiAddressSchema = Joi.object({
      name: Joi.string().trim().min(5).max(50).required(),
      line1: Joi.string().trim().min(10).max(100).required(),
      line2: Joi.string().trim().min(10).max(100).required(),
      pincode: Joi.string().trim().min(4).max(10).required(),
   });

   const joiCardsSchema = Joi.object({
      name: Joi.string().trim().min(5).max(50).required(),
      cardNumber: Joi.string().trim().min(8).max(30).required(),
   });

   const joiUserDetailSchema = Joi.object({
      user_id: Joi.objectId().required(),
      firstName: Joi.string().trim().min(5).max(50).required(),
      lastName: Joi.string().trim().min(5).max(50).required(),
      addresses: Joi.array().min(1).max(5).items(joiAddressSchema).required(),
      homePhone: Joi.number()
         .integer()
         .min(10 ** 4)
         .max(10 ** 19)
         .required(),
      workPhone: Joi.number()
         .integer()
         .min(10 ** 4)
         .max(10 ** 19)
         .required(),
      cards: Joi.array().min(1).max(5).items(joiCardsSchema).required(),
   });

   const ans = joiUserDetailSchema.validate(details);
   console.log(ans);

   return ans;
}

exports.UserDetail = UserDetail;
exports.validateUserDetail = validateUserDetail;
