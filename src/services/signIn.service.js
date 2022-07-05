const throwError = require("../helpers/error.helper");
const AccountService = require("../services/account.service");
const { db } = require("../config/connection.config");

const Users = db.collection("Users");

class SignInService {
  static async addUser(data) {
    const { fullName, id, idPhoto, incomeSource, email, password } = data;
    await Users.add({ fullName, id, idPhoto, incomeSource, email, password })
      .then((docRef) => {
        const accountCRC = {
          owner: docRef.id,
          currency: "₡",
          balance: 0,
          code: "CR",
        };
        AccountService.addAccount(accountCRC);
        const accountUSD = {
          owner: docRef.id,
          currency: "$",
          balance: 0,
          code: "US",
        };
        AccountService.addAccount(accountUSD);
      })
      .catch(() => {
        throwError(500, "Database error");
      });
  }
}

module.exports = SignInService;
