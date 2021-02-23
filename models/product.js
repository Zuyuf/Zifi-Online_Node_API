const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const mongoose = require("mongoose");
const _ = require("lodash");

const {} = require("./category");

//
//

//
const joiDetailRowSchema = Joi.object({
   propName: Joi.string().trim().min(3).max(50).required(),
   propValue: Joi.string().trim().min(3).max(255).required(),
});

const joiGroupDetailsSchema = Joi.object({
   propGroupName: Joi.string().trim().min(3).max(50).required(),
   props: Joi.array().min(1).max(25).items(joiDetailRowSchema),
});

const joiProductSchema = Joi.object({
   category_id: Joi.objectId().required(),
   name: Joi.string().trim().min(5).max(255).required(),
   price: Joi.number().integer().min(0).required(),
   description: Joi.string().trim().min(5).max(2048).required(),
   productDetails: Joi.array().min(1).max(10).items(joiGroupDetailsSchema),
});

//
const detailRowSchema = new mongoose.Schema({
   propName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
   },

   propValue: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
   },
});

const groupDetailsSchema = new mongoose.Schema({
   propGroupName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
   },

   props: {
      type: [detailRowSchema],
      required: true,
   },
});

const productSchema = new mongoose.Schema({
   category_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
   },

   name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
   },

   price: {
      type: Number,
      required: true,
      min: 0,
   },

   description: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 2048,
   },

   productDetails: {
      type: [groupDetailsSchema],
      required: true,
   },
});

//
productSchema.statics.pickReqiuredParams = function (data) {
   return _.pick(data, [
      "category_id",
      "name",
      "price",
      "addresses",
      "description",
      "productDetails",
   ]);
};

//

const Product = mongoose.model("Prduct", productSchema);

//
//
function validateDetailRow(row) {
   return joiDetailRowSchema.validate(row);
}

function validateGroupDetails(grpDtl) {
   return joiGroupDetailsSchema.validate(grpDtl);
}

function validateProduct(prodt) {
   return joiProductSchema.validate(prodt);
}

//
//

exports.Product = Product;

exports.productSchema = productSchema;
exports.validateProduct = validateProduct;
