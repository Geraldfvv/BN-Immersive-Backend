const express = require("express");
const UserService = require("../services/user.service");
const userRouter = express.Router();

userRouter.route("/")
.get(authenticateJWT, async (req, res, next) => {
  try {
    const response = await UserService.getUser(req.user);
    res.status(200).json({
      status: 200,
      data: response,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;
