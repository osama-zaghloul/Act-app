const {
    validate,
    Question
} = require("../models/question");
const {
    Category
} = require("../models/category");
const express = require("express");
const router = express.Router();

//Define the routes of questions

//Get all questions
router.get("/", async (req, res) => {
    try {
        // Fetch all questions from DB
        const questions = await Question.find().select('-__v').populate('categoryId', '-__v');
        if (questions.length == 0)
            return res.status(200).send({
                message: "Does not exist any question"
            });

        // Send questions to the client
        res.status(200).send(questions);

    } catch (err) {
        res.status(500).send(err.message);
    }
});

//Add new question
router.post("/", async (req, res) => {
    try {
        // Validate client request
        const {
            error
        } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        //Check if the category sent in the client request is exist in DB
        const category = await Category.findById(req.body.categoryId);
        if (!category) return res.status(400).send({
            message: "Invalid category ID"
        });

        // Save new question in DB
        const question = new Question({
            head: req.body.head,
            question: req.body.question,
            a: req.body.a,
            b: req.body.b,
            c: req.body.c,
            d: req.body.d,
            correct: req.body.correct,
            categoryId: req.body.categoryId,
        });
        await question.save();

        //Send response to client
        res.status(200).send({
            message: "Question has been saved successfully"
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//Update question
router.put("/update/:id", async (req, res) => {
    try {

        //Find the question by id
        let question = await Question.findById(req.params.id);
        if (!question) return res.status(404).send({
            message: "This question does not exist"
        });

        // Validate client request
        const {
            error
        } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        //Check if the category sent in the client request is exist in DB
        const category = await Category.findById(req.body.categoryId);
        if (!category) return res.status(400).send({
            message: "Invalid category ID"
        });

        // Update the question
        question.head = req.body.head;
        question.question = req.body.question;
        question.a = req.body.a;
        question.b = req.body.b;
        question.c = req.body.c;
        question.d = req.body.d;
        question.correct = req.body.correct;
        question.categoryId = req.body.categoryId;

        await question.save();

        //Send response to client
        res.status(200).send({
            message: "Question has been updated successfully"
        });

    } catch (err) {
        res.status(500).send(err.message);
    }
});

//show question from DB
router.post("/show/:id", async (req, res) => {
    try {

        //Find the question by id and remove
        let question = await Question.findById(req.params.id).select('-__v').populate('categoryId', '-__v');
        if (!question) return res.status(404).send({
            message: "This question does not exist"
        });

        //Send response to client
        res.status(200).send({
            question: question
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//Delete question from DB
router.delete("/delete/:id", async (req, res) => {
    try {

        //Find the question by id and remove
        let question = await Question.findByIdAndRemove(req.params.id);
        if (!question) return res.status(404).send({
            message: "This question does not exist"
        });

        //Send response to client
        res.status(200).send({
            message: "question has been deleted successfully"
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Get questions in particular category
router.post("/category-questions", async (req, res) => {
    try {

        // Fetch all questions in a particular category from the database
        const questions = await Question.find({
            categoryId: req.body.categoryId
        }, "-__v -categoryId");
        if (questions.length == 0)
            return res.status(404).send({
                message: "Does not exist any question"
            });

        // Send questions to the client
        res.status(200).send(questions);

    } catch (err) {
        res.status(500).send(err.message);
    }
});

// export router
module.exports = router;