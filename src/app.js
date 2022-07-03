const express = require("express");
const cors = require("cors");
const signInRouter = require("./routes/signIn.route");
const logInRouter = require("./routes/logIn.route");

const errorHandler = require("./middleware/error.middleware.js");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/signin", signInRouter);
app.use("/login",logInRouter)

app.use(errorHandler);

module.exports = app;
