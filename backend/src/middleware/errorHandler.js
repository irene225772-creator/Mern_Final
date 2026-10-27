function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  const isJsonParseError = error.type === 'entity.parse.failed';
  const isValidationError = error.name === 'ValidationError';
  const isCastError = error.name === 'CastError';
  const status = isJsonParseError || isValidationError ? 400 : isCastError ? 400 : 500;
  const message = isJsonParseError
    ? 'Request body must contain valid JSON.'
    : isValidationError || isCastError
      ? error.message
      : 'The server could not complete the request.';

  if (status === 500) console.error(error);
  res.status(status).json({ error: message });
}

module.exports = errorHandler;