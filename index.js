const adminAuth = require("./middlewares/adminAuth");
const categories = require("./routes/categories");
const questions = require("./routes/questions");
const exams = require("./routes/exams");
const tokens = require("./routes/tokens");
const admins = require('./routes/admins');
const config = require("config");
const mongoose = require("mongoose");
const express = require("express");
const app = express();

//Check if jwtPrivateKey is defined in environment variables
if (!config.get('jwtPrivateKey')) {
  console.log('jwtPrivateKey is not defined');
  process.exit(1);
}

//Listen to port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});

// Connect to database
mongoose
  .connect("mongodb://localhost/ACT")
  .then(console.log("connected to MongoDB"))
  .catch("Could not connect to MongoDB");

//middlewares
app.use(express.json());

// Define router middlewares
app.use("/api/categories", adminAuth, categories);
app.use("/api/questions", adminAuth, questions);
app.use("/api/exams", adminAuth, exams);
app.use("/api/tokens", tokens);
app.use("/api/admins", admins);