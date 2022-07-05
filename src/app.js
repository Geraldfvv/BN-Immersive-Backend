const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const signInRouter = require("./routes/signIn.route");
const logInRouter = require("./routes/logIn.route");
const accountRouter = require("./routes/accounts.route");
const transferRouter = require("./routes/transfer.route");

const errorHandler = require("./middleware/error.middleware.js");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ["http://localhost:3000","https://bn-immersive.herokuapp.com/"],
    credentials: true,
  })
);

app.use(cookieParser());

app.use("/signin", signInRouter);
app.use("/login", logInRouter);
app.use("/accounts", accountRouter);
app.use("/transfer", transferRouter); //needs middleware to validate integrity

app.use(errorHandler);

module.exports = app;
