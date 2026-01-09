export const ErrorHandler = (err, req, res, next) => {
  const status = res.statusCode ? res.statusCode : 500;
  res.status(status).json({
    error: err.message,
  });
};
