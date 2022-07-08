const throwError = require("../helpers/error.helper");
const AccountService = require("./account.service");
const { db } = require("../config/connection.config");

const Accounts = db.collection("Accounts");
const Transactions = db.collection("Transactions");

class TransferService {
  static async transferMoney(origin, destiny, amount, detail) {
    const originAcc = await Accounts.where("iban", "==", origin).get();
    const destinyAcc = await Accounts.where("iban", "==", destiny).get();

    let auxOrigin;
    let auxDestiny;

    //Checks if origin exists
    if (!originAcc.empty) {
      auxOrigin = originAcc.docs[0];
      //Checks if origin has enough funds
      if (auxOrigin.data().balance >= parseInt(amount)) {
        //Checks if accounts are of the same currency
        if (origin.substring(0, 2) === destiny.substring(0, 2)) {
          //Checks if destiny exists
          if (!destinyAcc.empty) {
            auxDestiny = destinyAcc.docs[0];
            //Adds amount to the account
            await Accounts.doc(auxDestiny.id).update({
              balance: auxDestiny.data().balance + parseInt(amount),
            });
          }
        } else {
          throwError(
            400,
            JSON.stringify({
              destiny: "Different currency between accounts!",
            })
          );
        }

        //Discounds amount to the account
        await Accounts.doc(auxOrigin.id).update({
          balance: auxOrigin.data().balance - parseInt(amount),
        });

        const currency = auxOrigin
          ? auxOrigin.data().currency
          : auxDestiny.data().currency;

        const idOrigin = auxOrigin ? auxOrigin.id : null;
        const idDestiny = auxDestiny ? auxDestiny.id : null;

        const date = new Date();
        await Transactions.add({
          origin,
          idOrigin,
          destiny,
          idDestiny,
          amount,
          detail,
          date,
          currency,
        }).then(() => {
          return;
        });
      } else {
        throwError(400, JSON.stringify({ amount: "Not enough funds" }));
      }
    } else {
      //Checks if destiny exists
      if (!destinyAcc.empty) {
        auxDestiny = destinyAcc.docs[0];

        if (origin.substring(0, 2) === destiny.substring(0, 2)) {
          //Adds amount to the account
          await Accounts.doc(auxDestiny.id).update({
            balance: auxDestiny.data().balance + parseInt(amount),
          });
        } else {
          throwError(
            400,
            JSON.stringify({
              destiny: "Different currency between accounts!",
            })
          );
        }

        const currency = auxOrigin
          ? auxOrigin.data().currency
          : auxDestiny.data().currency;

        const idOrigin = auxOrigin ? auxOrigin.id : null;
        const idDestiny = auxDestiny ? auxDestiny.id : null;

        const date = new Date();
        await Transactions.add({
          origin,
          idOrigin,
          destiny,
          idDestiny,
          amount,
          detail,
          date,
          currency,
        }).then(() => {
          return;
        });
      } else {
        throwError(404, JSON.stringify({ destiny: "Account not found" }));
      }
    }
  }

  static async getTransfers(account, startDate, endDate) {
    const originTransfers = await Transactions.where("idOrigin", "==", account)
      .where("date", ">=", new Date(startDate))
      .where("date", "<=", new Date(endDate))
      .orderBy("date", "desc")
      .get();

    const destinyTransfers = await Transactions.where(
      "idDestiny",
      "==",
      account
    )
      .where("date", ">=", new Date(startDate))
      .where("date", "<=", new Date(endDate))
      .orderBy("date", "desc")
      .get();

    let transfers = [];
    originTransfers.docs.forEach((doc) => {
      let transaction = doc.data();
      transaction.id = doc.id;
      transfers.push({ ...transaction, date: transaction.date.toDate() });
    });
    destinyTransfers.docs.forEach((doc) => {
      let transaction = doc.data();
      transaction.id = doc.id;
      transfers.push({ ...transaction, date: transaction.date.toDate() });
    });

    return {
      transfers: transfers,
      account: await AccountService.getAccountById(account),
    };
  }
}

module.exports = TransferService;
