const throwError = require("../helpers/error.helper");
const { db } = require("../config/connection.config");

const Users = db.collection("Users");

class UserService {
  static async getUser(id) {
    try {
      const user = await Users.doc(id).get();
      return user.data();
    } catch (err) {
      throwError(500, "Database error");
    }
  }
}

module.exports = UserService;
