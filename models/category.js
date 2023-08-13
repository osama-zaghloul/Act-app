const Joi = require("joi");
const mongoose = require("mongoose");

//Create category model
const Category = mongoose.model(
  "Category",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 255,
    },
    time: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 255,
    }

  })
);

//Validate client request using joi
function validateCategory(category) {
  const schema = {
    name: Joi.string().min(3).max(255).required(),
    time: Joi.string().min(1).max(255).required(),
  };
  return Joi.validate(category, schema);
}

//export category model and validateCategory function
exports.Category = Category;
exports.validate = validateCategory;