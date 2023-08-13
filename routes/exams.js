const {
    validate,
    Exam
} = require("../models/exam");
const {
    Question
} = require("../models/question");
const {
    Token
} = require("../models/token");
const express = require("express");
const router = express.Router();

//Define the routes of exams

//Get all exams
router.get("/", async (req, res) => {
    try {
        // Fetch all exams from the database
        const exams = await Exam.find()
            .populate("questions", "-__v")
            .select("-__v");
        if (exams.length == 0)
            return res.status(404).send({
                message: "Does not exist any exam"
            });

        // Send exams to the client
        res.status(200).send(exams);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//Add new exam
router.post("/", async (req, res) => {
    try {
        // Validate client request
        const {
            error
        } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        // Save new exam in DB
        const exam = new Exam({
            name: req.body.name,
        });
        await exam.save();

        //Send response to client
        res.status(200).send({
            message: "Exam has been saved successfully"
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//update an exam
router.put("/update/:id", async (req, res) => {
    try {
        // Validate client request
        const {
            error
        } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        //Find the exam by id
        let exam = await Exam.findById(req.params.id);
        if (!exam) return res.status(404).send({
            message: "This exam does not exist"
        });

        //Check if all questions sent in the client request is exist in DB
        const questions = await Question.findById({
            $in: req.body.questions,
        }).count();
        if (questions !== req.body.questions.length)
            return res.status(400).send({
                message: "Questions must be valid"
            });

        // Update the question
        exam.name = req.body.name;
        exam.questions = req.body.questions;
        await exam.save();

        //Send response to client
        res.status(200).send({
            message: "Exam has been updated successfully"
        });

    } catch (err) {
        res.status(500).send(err.message);
    }
});



//Delete an exam
router.delete("/delete/:id", async (req, res) => {
    try {
        //Find the exam by id and remove
        let exam = await Exam.findByIdAndRemove(req.params.id);
        if (!exam) return res.status(404).send({
            message: "This exam does not exist"
        });

        //Send response to client
        res.status(200).send({
            message: "Exam has been deleted successfully"
        });

    } catch (err) {
        res.status(500).send(err.message);
    }
});

//Get a particular exam
router.post("/show/:id", async (req, res) => {
    try {

        // Get the exam from the database
        const exam = await Exam.findById(req.params.id)
            .populate("questions", "-__v")
            .select("-__v");
        if (!exam) return res.status(404).send({
            message: "This exam does not exist"
        });

        // Send exam to the client
        res.status(200).send({
            exam: exam,
        });

    } catch (err) {
        res.status(500).send(err.message);
    }
});

// export router
module.exports = router;