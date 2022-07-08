const throwError = require("../helpers/error.helper");
const serviceList = require("../constants/services.constants");
const TransferService = require("./transfer.service");

const { db } = require("../config/connection.config");
const Bills = db.collection("Bills");
const Services = db.collection("Services");
const Accounts = db.collection("Accounts");

class ServicesService {
  static async getServices(category = "") {
    let services;
    if (category == "") {
      services = await Services.get();
    } else {
      services = await Services.where("category", "==", category).get();
    }

    let servicesList = [];
    services.docs.forEach((doc) => {
      servicesList.push(doc.data());
    });

    return servicesList;
  }

  static async generateBills(user) {
    let services = await this.getServices();
    let serviceNames = services.map((service) => {
      return `${service.category} ${service.name}`;
    });

    let userServices = [];
    for (var i = 0; i <= 5; i++) {
      let random = Math.floor(Math.random() * serviceNames.length);
      let amount = Math.floor(Math.random() * 100000);
      let service = {
        name: serviceNames[random],
        amount: amount,
        status: "pending",
        billNumber: user,
      };
      serviceNames.splice(random, 1);
      userServices.push(service);
    }
    userServices.forEach(async (service) => {
      await Bills.add(service).catch(() => {
        throwError(500, "Database error");
      });
    });
  }

  static async checkService(service, billNumber) {
    const bill = await Bills.where("name", "==", service)
      .where("billNumber", "==", billNumber)
      .where("status", "==", "pending")
      .get();

    if (bill.empty) {
      return [];
    } else {
      let result = bill.docs[0].data();
      result.id = bill.docs[0].id;
      return result;
    }
  }

  static async payBill(iban, idBill) {
    const acc = await Accounts.where("iban", "==", iban).get();
    const bill = await Bills.doc(idBill).get();

    let auxAcc = acc.docs[0];
    let amount;

    if (auxAcc.data().currency == "$") {
      amount = bill.data().amount / 680;
    } else {
      amount = bill.data().amount;
    }

    const currency = auxAcc.data().currency == "$" ? "US" : "CR"

    await TransferService.transferMoney(
      auxAcc.data().iban,
      currency,
      Math.round(amount),
      bill.data().name
    );

    await Bills.doc(bill.id).update({
      status: "paid",
    });

    return { accc: auxAcc, bill: bill };
  }
}

module.exports = ServicesService;
