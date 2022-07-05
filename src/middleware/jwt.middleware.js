const throwError = require("../helpers/error.helper");
const jwt = require("jsonwebtoken");

authenticateJWT = (req, res, next) => {
  const authCookies = req.cookies.user;

  if (authCookies) {
    try {
      const decoded = jwt.verify(authCookies, "my-ultra-secure-key");
      req.user = decoded;
      next();
    } catch {
      throwError(401, "Unauthorized");
    }
  } else {
    throwError(401, "Unauthorized");
  }
};

module.exports = authenticateJWT;
