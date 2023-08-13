const {
    validate,
    Admin
} = require("../models/admin");
const superAdmin = require('../middlewares/superAdmin');
const adminAuth = require('../middlewares/adminAuth');
const bcrypt = require('bcrypt');
const express = require("express");
const router = express.Router();

//Define the routes of questions

//Get all admins
router.get("/", [adminAuth, superAdmin], async (req, res) => {
    try {
        // Fetch all admins from DB
        const admins = await Admin.find().select('-__v');
        if (admins.length == 0)
            return res.status(404).send({
                message: "Does not exist any admin"
            });

        // Send admins to the client
        res.status(200).send(admins);

    } catch (err) {
        res.status(500).send(err.message);
    }
});

//Add new admin
router.post("/", [adminAuth, superAdmin], async (req, res) => {
    try {
        // Validate client request
        const {
            error
        } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);


        // create new admin in DB
        let admin = new Admin({
            userName: req.body.userName,
            password: req.body.password,
        });

        //hashing password
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(admin.password, salt);

        //save new admin in DB
        await admin.save();

        //Send response to client
        res.status(200).send({
            message: "Admin has been saved successfully"
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//Update admin
router.put("/update/:id", [adminAuth, superAdmin], async (req, res) => {
    try {
        // Validate client request
        const {
            error
        } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        //Find the admin by id
        let admin = await Admin.findById(req.params.id);
        if (!admin) return res.status(404).send({
            message: "This admin does not exist"
        });

        //Generate salt for hashing password
        const salt = await bcrypt.genSalt(10);

        // Update the admin
        admin.userName = req.body.userName;
        admin.password = await bcrypt.hash(admin.password, salt);

        //Save the admin in DB
        await admin.save();

        //Send response to client
        res.status(200).send({
            message: "Admin has been updated successfully"
        });

    } catch (err) {
        res.status(500).send(err.message);
    }
});



//Show admin
router.post("/show/:id", [adminAuth, superAdmin], async (req, res) => {
    try {

        //Find the admin by id
        const admin = await Admin.findById(req.params.id).select('userName');
        if (!admin) return res.status(404).send({
            message: "This admin does not exist"
        });

        //Send response to client
        res.status(200).send({
            admin: admin
        });

    } catch (err) {
        res.status(500).send(err.message);
    }
});

//Delete admin from DB
router.delete("/delete/:id", [adminAuth, superAdmin], async (req, res) => {
    try {

        //Find the admin by id and remove
        const admin = await Admin.findByIdAndRemove(req.params.id);
        if (!admin) return res.status(404).send({
            message: "This admin does not exist"
        });

        //Send response to client
        res.status(200).send({
            message: "Admin has been deleted successfully"
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//Admin authentication
router.post("/auth", async (req, res) => {
    try {

        // Validate client request
        const {
            error
        } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let admin = await Admin.findOne({
            userName: req.body.userName
        }).select('-__v');
        if (!admin) return res.status(400).send({
            message: 'Invalid userName or password'
        });

        const validPassword = await bcrypt.compare(req.body.password, admin.password);
        if (!validPassword) return res.status(400).send({
            message: 'Invalid userName or password'
        });

        //Generate json web token
        const token = admin.generateAuthToken();

        // Send response to the client
        res.status(200).header('x-auth-token', token).send({
            message: "login has done successfully",
            admin: admin
        });

    } catch (err) {
        res.status(500).send(err.message);
    }
});

// export router
module.exports = router;