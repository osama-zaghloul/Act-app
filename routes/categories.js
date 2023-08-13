const {
    validate,
    Category
} = require("../models/category");
const express = require("express");
const router = express.Router();

//Define the routes of categories

//Get all categories
router.get("/", async (req, res) => {
    try {
        //Fetch all categories from the database
        const categories = await Category.find().select('-__v');
        if (categories.length == 0)
            return res.status(404).send({
                message: "does not exist any category"
            });

        //Send categories to the client
        res.status(200).send(categories);

    } catch (err) {
        res.status(500).send(err.message);
    }
});


//add new category
router.post("/", async (req, res) => {

    try {

        // Validate client request
        const {
            error
        } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        // Save new category in DB
        const category = new Category({
            name: req.body.name,
            time: req.body.time,
        });
        await category.save();

        //Send response to client
        res.status(200).send({
            message: "Category has been saved successfully"
        });

    } catch (err) {
        res.status(500).send(err.message);
    }
});


//Update category
router.put("/update/:id", async (req, res) => {
    try {
        // Validate client request
        const {
            error
        } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        //Find the category by id
        let category = await Category.findById(req.params.id);
        if (!category) return res.status(404).send({
            message: "This category does not exist"
        });

        // Update the category
        category.name = req.body.name;
        category.time = req.body.time;
        await category.save();

        //Send response to client
        res.status(200).send({
            message: "Category has been updated successfully"
        });

    } catch (err) {
        res.status(500).send(err.message);
    }
});


//Delete category from DB
router.delete("/delete/:id", async (req, res) => {
    try {
        //Find the category by id and remove
        let category = await Category.findByIdAndRemove(req.params.id);
        if (!category) return res.status(404).send({
            message: "This category does not exist"
        });

        //Send response to client
        res.status(200).send({
            message: "Category has been deleted successfully"
        });

    } catch (err) {
        res.status(500).send(err.message);
    }
});




// export router
module.exports = router;