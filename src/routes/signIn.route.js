const express = require("express");
const signInValidate = require("../middleware/signIn.middleware.js");
const SignInService = require("../services/signIn.service");
const signInRouter = express.Router();

signInRouter.route("/").post(signInValidate, async (req, res, next) => {

  const image = req.files.idPhoto.data;
  const data = req.body;

  try {
    const url = await SignInService.uploadImage(image);
    await SignInService.addUser({ ...data, idPhoto: url });
    res.status(200).json({ message: "Signed in successfully", status: 200 });
  } catch (error) {
    throwError(500, "Server error");
  }
});

module.exports = signInRouter;
