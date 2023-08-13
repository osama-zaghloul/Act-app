const Joi = require("joi");
const mongoose = require("mongoose");
const config = require('config');
const jwt = require('jsonwebtoken');

//Create admin model
const adminSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        maxlength: 1024,
    },
    superAdmin: {
        type: Boolean,
        default: false,
    }
});

adminSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({
        _id: this._id,
        userName: this.userName,
        superAdmin: this.superAdmin
    }, config.get('jwtPrivateKey'));
    return token;
}

const Admin = mongoose.model("Admin", adminSchema);

// Validate client request using joi
function validateAdmin(admin) {
    const schema = {
        userName: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(6).max(255).required(),
    };
    return Joi.validate(admin, schema, {
        abortEarly: false,
    });
}

//export category model and validateCategory function
exports.Admin = Admin;
exports.validate = validateAdmin;