const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const signInRouter = require("./routes/signIn.route");
const logInRouter = require("./routes/logIn.route");
const accountRouter = require("./routes/accounts.route");
const transferRouter = require("./routes/transfer.route");
const serviceRouter = require("./routes/services.route");
const userRouter = require("./routes/user.route");

const errorHandler = require("./middleware/error.middleware.js");

const app = express();
app.use(fileUpload());
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/signin", signInRouter);
app.use("/login", logInRouter);
app.use("/accounts", accountRouter);
app.use("/transfer", transferRouter);
app.use("/services", serviceRouter);
app.use("/user", userRouter);

app.use(errorHandler);

module.exports = app;
