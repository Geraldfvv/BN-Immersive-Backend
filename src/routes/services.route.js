const express = require("express");
const ServicesService = require("../services/services.service");
const serviceRouter = express.Router();

serviceRouter.route("/").get(async (req, res, next) => {
  const category = req.query.category;
  try {
    const result = await ServicesService.getServices(category);
    res.status(200).json({
      status: 200,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

serviceRouter.route("/check").get(async (req, res, next) => {
  const billNumber = req.query.billNumber;
  const service = req.query.service;
  try {
    const result = await ServicesService.checkService(service, billNumber);
    res.status(200).json({
      status: 200,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

serviceRouter.route("/pay").post(async (req, res, next) => {
  const iban = req.body.iban;
  const bill = req.body.bill;
  try {
    const result = await ServicesService.payBill(iban, bill);
    res.status(200).json({
      status: 200,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = serviceRouter;
