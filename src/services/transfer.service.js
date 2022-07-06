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
      if (auxOrigin.data().balance > amount) {
        //Checks if destiny exists
        if (!destinyAcc.empty) {
          auxDestiny = destinyAcc.docs[0];

          //Checks if accounts are of the same currency
          if (auxDestiny.data().currency === auxOrigin.data().currency) {
            //Adds amount to the account
            await Accounts.doc(auxDestiny.id).update({
              balance: auxDestiny.data().balance + amount,
            });
          } else {
            throwError(
              500,
              "You can only make transfers between accounts of the same currency"
            );
          }
        }

        //Discounds amount to the account
        await Accounts.doc(auxOrigin.id).update({
          balance: auxOrigin.data().balance - amount,
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
        throwError(500, "Not enough funds");
      }
    } else {
      throwError(404, "Account not found");
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

    let debits = [];
    originTransfers.docs.forEach((doc) => {
      let transaction = doc.data();
      transaction.id = doc.id;
      debits.push({ ...transaction, date: transaction.date.toDate() });
    });
    let credits = [];
    destinyTransfers.docs.forEach((doc) => {
      let transaction = doc.data();
      transaction.id = doc.id;
      credits.push({ ...transaction, date: transaction.date.toDate() });
    });

    return {
      transfers: { debits: debits, credits: credits },
      account: await AccountService.getAccountById(account),
    };
  }
}

module.exports = TransferService;
