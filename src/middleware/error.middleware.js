errorHandler = (err, req, res, next) => {
  const error = err.statusCode ? err.statusCode : 500
  res.status(error);
  res.json({ errors: err.message });
};

module.exports = errorHandler;
