import { StatusCodes } from "http-status-codes";

// eslint-disable-next-line no-unused-vars
const globalErrorHandler = (err, req, res, next) => {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err.message || "Something went wrong!",
    error: err,
  });
};

export default globalErrorHandler;
