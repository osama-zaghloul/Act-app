const {
    validateAnswers,
    Token
} = require("../models/token");
const adminAuth = require("../middlewares/adminAuth");
const randomToken = require("random-token");
const express = require("express");
const router = express.Router();

//Define the routes of tokens

//Get all tokens
router.get("/", adminAuth, async (req, res) => {
    try {
        // Fetch all tokens from the database
        const tokens = await Token.find().select("-__v");
        if (tokens.length == 0)
            return res.status(404).send({
                message: "does not exist any token"
            });

        // Send tokens to the client
        res.status(200).send(tokens);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//Generate token
router.get("/generate", adminAuth, async (req, res) => {
    try {
        //Generate token
        const token = randomToken(10);
        const dbToken = await Token.findOne({
            token: token,
        });
        if (dbToken) return res.status(404).send({
            message: "Please try again"
        });

        //Save the token in DB
        await new Token({
            token: token,
            email: token,
            phone: token,
        }).save();

        //Send the token to the client
        res.status(200).send({
            token: token,
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});



//Delete token from DB
router.delete("/delete/:id", adminAuth, async (req, res) => {
    try {
        //Find the token by id and remove
        let token = await Token.findByIdAndRemove(req.params.id);
        if (!token)
            return res.status(404).send({
                message: "This token does not exist",
            });

        res.status(200).send({
            message: "Token has been deleted successfully",
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});


//Get a particular exam
router.post("/login", async (req, res) => {
    try {
        //Check if request contains token
        if (!req.body.token) res.status(400).send({
            message: "Token is required"
        });

        //Check if request contains ip
        if (!req.body.ip) res.status(400).send({
            message: "ip is required"
        });

        //Check if the token is valid
        const token = await Token.findOne({
            token: req.body.token,
        });
        if (!token) return res.status(400).send({
            message: "This token is invalid"
        });

        //Check if the exam is valid only on the same machine
        if (token.status == 1 && token.ip !== req.body.ip) return res.status(400).send({
            message: "Must continue the exam in the same machine"
        });

        // Get the exam from the database
        const exam = await Exam.findById(token.examId)
            .populate("category", "name -_id")
            .populate("questions", "-__v")
            .select("-__v");
        if (!exam) return res.status(404).send({
            message: "This exam does not exist"
        });

        //Set the start date and ip in token document and update status
        if (token.status == 0) token.date = new Date();
        token.ip = req.body.ip;
        token.name = req.body.name;
        token.email = req.body.email;
        token.status = 1;
        await token.save();

        // Send exam to the client
        res.status(200).send({
            exam: exam,
            token: req.body.token,
        });

    } catch (err) {
        res.status(500).send(err.message);
    }
});



//Save the result of the exam
router.post("/submit-answers", async (req, res) => {
    try {

        //Validate client request
        const {
            error
        } = validateAnswers(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        //Get the token from the database
        const token = await Token.findOne({
            token: req.body.token,
        });
        if (!token)
            return res.status(404).send({
                message: "This token is invalid",
            });

        //Save data in DB
        token.answers = req.body.answers;
        token.answerDuration = req.body.answerDuration;
        token.status = 2;
        await token.save();

        //Send exams to the client
        res.status(200).send({
            message: "answers have been saved successfully",
        });

    } catch (err) {
        res.status(500).send(err.message);
    }
});


// // export router
module.exports = router;