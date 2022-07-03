const jwt = require("jsonwebtoken");

const jwtSign = (data) => {
  return jwt.sign(data, "my-ultra-secure-key")
};

module.exports = { jwtSign };
