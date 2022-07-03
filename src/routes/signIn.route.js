const express = require("express");
const signInValidate = require("../middleware/signIn.middleware.js");
const SignInService = require("../services/signIn.service");
const signInRouter = express.Router();

signInRouter.route("/").post(signInValidate, async (req, res, next) => {
  const data = req.body;

  try {
    await SignInService.addUser(data);
    res.status(200).json({ message: "Signed in successfully", status: 200 });
  } catch (error) {
    next(error);
  }
});

module.exports = signInRouter;
