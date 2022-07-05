const throwError = require("../helpers/error.helper");
const { db } = require("../config/connection.config");

const Accounts = db.collection("Accounts");
const Transactions = db.collection("Transactions");

class TransferService {
  static async transferMoney(origin, destiny, amount, detail) {
    const originAcc = await Accounts.where("iban", "==", origin).get();
    const destinyAcc = await Accounts.where("iban", "==", destiny).get();

    //Checks if origin exists
    if (!originAcc.empty) {
      const auxOrigin = originAcc.docs[0];
      //Checks if origin has enough funds
      if (auxOrigin.data().balance > amount) {
        //Checks if destiny exists
        if (!destinyAcc.empty) {
          const auxDestiny = destinyAcc.docs[0];

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

        const date = new Date();
        await Transactions.add({ origin, destiny, amount, detail, date }).then(
          () => {
            return;
          }
        );
      } else {
        throwError(500, "Not enough funds");
      }
    } else {
      throwError(404, "Account not found");
    }
  }
}

module.exports = TransferService;
