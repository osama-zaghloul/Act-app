const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");


//Create token model
const Token = mongoose.model(
    "Token",
    new mongoose.Schema({
        token: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
            maxlength: 255,
            unique: true,
        },
        name: {
            type: String,
            trim: true,
            minlength: 2,
            maxlength: 255,
        },
        email: {
            type: String,
            trim: true,
            minlength: 2,
            maxlength: 255,
            unique: true,
        },
        phone: {
            type: String,
            trim: true,
            minlength: 5,
            maxlength: 15
        },
        score: {
            type: String,
            trim: true,
            minlength: 1,
            maxlength: 255,
        },
        answers: [{
            questionId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Question",
            },
            answer: {
                type: String,
                trim: true,
                maxlength: 255,
            },
        }, ],
        status: {
            type: Number,
            default: 0,
        },
        ip: {
            type: String,
            minlength: 1,
            maxlength: 255,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        date: {
            type: Date,
            minlength: 1,
            maxlength: 255,
        },
        answerDuration: {
            type: String,
            trim: true,
            minlength: 1,
            maxlength: 255,
        },
        examId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exam",
        }
    })
);

// Validate client request using joi
function validateToken(token) {
    const schema = {
        token: Joi.string().min(2).max(255).required(),
        name: Joi.string().min(2).max(255).required(),
        phone: Joi.string().min(5).max(15).required(),
        email: Joi.string().required().email({
            tlds: {
                allow: false
            }
        }),
        score: Joi.string().min(1).max(255),
        ip: Joi.string().min(1).max(255),
        examId: Joi.objectId().required(),
    };
    return Joi.validate(token, schema, {
        abortEarly: false,
    });
}

// Validate client request submit-answers api using joi
function validateSubmitAnwers(request) {
    const schema = {
        token: Joi.string().min(2).max(255).required(),
        answers: Joi.array(),
        answerDuration: Joi.string().min(1).max(255),
    };
    return Joi.validate(request, schema, {
        abortEarly: false,
    });
}

//export category model and validateCategory function
exports.Token = Token;
exports.validate = validateToken;
exports.validateAnswers = validateSubmitAnwers;