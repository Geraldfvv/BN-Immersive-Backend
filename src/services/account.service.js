const throwError = require("../helpers/error.helper");
const { db } = require("../config/connection.config");

const Accounts = db.collection("Accounts");

const ibanGenerator = (code) => {
  const min = 10000000000000000000;
  const max = 99999999999999999999;
  return code + Math.random() * (max - min);
};

class AccountService {
  static async addAccount(data) {
    const { owner, currency, balance, code } = data;
    const iban = ibanGenerator(code);
    await Accounts.add({ owner, currency, balance, iban })
      .then(() => {
        return;
      })
      .catch(() => {
        throwError(500, "Database error");
      });
  }

  static async getAccounts(user) {
    try {
      const accounts = await Accounts.where("owner", "==", user).get();

      const response = [];
      accounts.docs.forEach((doc) => {
        response.push(doc.data());
      });

      return response;
    } catch (err) {
      throwError(500, "Database error");
    }
  }
}

module.exports = AccountService;
