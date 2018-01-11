/**
 * Wrapper for async/await functions that that passes error to error handle middleware
 * @param  {Function} fn - async/await function
 * @return {Function} - wrapped function
 */
exports.catchErrors = fn => (req, res, next) => fn(req, res, next).catch(next);

/**
 * Handles any errors that has been passed through middlewares
 */
exports.errorHandlerMiddleware = (err, req, res, next) => {
  console.dir(err);
  res.status(err.status || 500);
  res.json({ message: err.message, error: err });
}