import { AppError } from "../utils/appError.util.js";

const globalErrorHandler = (error, req, res, next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  console.error(`Error: ${error}`);

  const statusCode = 500;
  const message = "Unexpected error! Please try again later.";

  return res.status(statusCode).json({ message });
};

export default globalErrorHandler;
