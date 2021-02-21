const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const _ = require("lodash");

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

   phoneNumber: {
      type: Number,
      required: true,
      minlength: 5,
      maxlength: 20,
   },

   landMark: {
      type: String,
      minlength: 5,
      maxlngth: 50,
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

   addresses: [address],

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

   cards: [card],
});

userDetailSchema.statics.pickReqiuredParams = function (data) {
   return _.pick(data, [
      "user_id",
      "firstName",
      "lastName",
      "addresses",
      "homePhone",
      "workPhone",
      "cards",
   ]);
};

const UserDetail = mongoose.model("UserDetail", userDetailSchema);

function validateUserDetail(details) {
   const joiAddressSchema = Joi.object({
      name: Joi.string().trim().min(5).max(50).required(),
      line1: Joi.string().trim().min(10).max(100).required(),
      line2: Joi.string().trim().min(10).max(100).required(),
      pincode: Joi.string().trim().min(4).max(10).required(),
      phoneNumber: Joi.number()
         .integer()
         .min(10 ** 4)
         .max(10 ** 19)
         .required(),
      landMark: Joi.string().trim().min(5).max(50).required(),
   });

   const joiCardsSchema = Joi.object({
      name: Joi.string().trim().min(5).max(50).required(),
      cardNumber: Joi.string().trim().min(8).max(30).required(),
   });

   const joiUserDetailSchema = Joi.object({
      firstName: Joi.string().trim().min(5).max(50).required(),
      lastName: Joi.string().trim().min(5).max(50).required(),
      addresses: Joi.array().min(1).max(5).items(joiAddressSchema),
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
      cards: Joi.array().min(1).max(5).items(joiCardsSchema),
   });

   return joiUserDetailSchema.validate(details);
}

exports.UserDetail = UserDetail;
exports.validateUserDetail = validateUserDetail;
