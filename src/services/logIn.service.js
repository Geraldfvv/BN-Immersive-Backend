const { db } = require("../config/connection.config");
const throwError = require("../helpers/error.helper");
const { jwtSign } = require("../helpers/jwt.helper");

const Users = db.collection("Users");

class LogInService {
  static async logIn(data) {
    const { email, password } = data;
    const users = await Users.where("email", "==", email).get();
    if (users.empty) {
      throwError(404, "You have entered an invalid email or password");
    } else {
      const user = users.docs[0].data();
      if (password === user.password) {
        const token = jwtSign({ email: user.email, fullName: user.fullName });
        return token;
      } else {
        throwError(404, "You have entered an invalid email or password");
      }
    }
  }
}

module.exports = LogInService;
