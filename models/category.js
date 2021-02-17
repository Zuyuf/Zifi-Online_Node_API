const { func } = require("joi");
const Joi = require("joi");
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
   },
});

const Category = mongoose.model("Category", categorySchema);

function validateCategory(category) {
   const joiSchema = {
      name: Joi.string().min(5).max(50).required(),
   };

   return Joi.validate(category, joiSchema);
}

exports.Category = Category;
exports.validateCategory = validateCategory;
