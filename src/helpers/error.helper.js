throwError = (statusCode, message) => {
  let err = Error(message);
  err.statusCode = statusCode;
  throw err;
};

module.exports = throwError;
