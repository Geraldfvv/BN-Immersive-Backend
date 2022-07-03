errorHandler = (err, req, res, next) => {
  res.status(err.statusCode);
  res.json({ errors: err.message });
};

module.exports = errorHandler;
