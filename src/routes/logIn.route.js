const express = require("express");
const LogInService = require("../services/logIn.service");
const logInRouter = express.Router();

logInRouter.route("/").post(async (req, res, next) => {
  const data = req.body;

  try {
    const result = await LogInService.logIn(data);
    res.status(200).json({
      message: "Logged in successfully",
      status: 200,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = logInRouter;
