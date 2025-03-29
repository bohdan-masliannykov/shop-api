class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const throwError = (statusCode, message) => {
  throw new AppError(statusCode, message);
};

export { AppError, throwError };
