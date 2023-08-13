const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");

//Create exam model
const Exam = mongoose.model("Exam", new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 255,
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
    }, ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isActive: {
        type: Boolean,
        default: true,
    }
}));

// Validate client request using joi
function validateExam(exam) {
    const schema = {
        name: Joi.string().min(2).max(255).required(),
        questions: Joi.array().min(1),
    };
    return Joi.validate(exam, schema, {
        abortEarly: false,
    });
}

//export category model and validateCategory function
exports.Exam = Exam;
exports.validate = validateExam;