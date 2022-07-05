const express = require("express");
const AccountService = require("../services/account.service");
const authenticateJWT = require("../middleware/jwt.middleware");

const accountRouter = express.Router();

accountRouter.route("/").get(authenticateJWT, async (req, res, next) => {
  try {
    const response = await AccountService.getAccounts(req.user);
    res.status(200).json({
      status: 200,
      data: response,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = accountRouter;
