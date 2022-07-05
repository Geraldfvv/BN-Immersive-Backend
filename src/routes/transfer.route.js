const express = require("express");
const TransferService = require("../services/transfer.service");
const authenticateJWT = require("../middleware/jwt.middleware");

const transferRouter = express.Router();

transferRouter.route("/").post(async (req, res, next) => {
  try {
    const { origin, destiny, amount, detail } = req.body;
    const response = await TransferService.transferMoney(
      origin,
      destiny,
      amount,
      detail
    );
    res.status(200).json({
      status: 200,
      data: response,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = transferRouter;
