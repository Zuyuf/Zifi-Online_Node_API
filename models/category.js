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
   const joiCategorySchema = Joi.object({
      name: Joi.string().min(5).max(50).required(),
   });

   return joiCategorySchema.validate(category);
}

exports.categorySchema = categorySchema;
exports.Category = Category;
exports.validateCategory = validateCategory;
