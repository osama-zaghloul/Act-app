const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
require("mongoose-long")(mongoose);
var Long = mongoose.Schema.Types.Long;

//Create question model
const Question = mongoose.model("Question", new mongoose.Schema({
  head: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
  },
  question: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
  },
  a: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  b: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  c: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  d: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  correct: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  }
}));

// Validate client request using joi
function validateQuestion(question) {
  const schema = {
    head: Joi.string().min(3).required(),
    question: Joi.string().min(3).required(),
    a: Joi.string().min(1).required(),
    b: Joi.string().min(1).required(),
    c: Joi.string().min(1).required(),
    d: Joi.string().min(1).required(),
    correct: Joi.string().required(),
    categoryId: Joi.objectId().required(),
  };
  return Joi.validate(question, schema, {
    abortEarly: false,
  });
}

//export category model and validateCategory function
exports.Question = Question;
exports.validate = validateQuestion;