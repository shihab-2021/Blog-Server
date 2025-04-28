import express from "express";
import cors from "cors";
// import cookieParser from "cookie-parser";
import { StatusCodes } from "http-status-codes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler.js";
import router from "./app/routes/index.js";

const app = express();

// parsers
app.use(express.json());
// app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

// routes
app.use("/api", router);

app.get("/", (req, res) => {
  res.send({
    status: true,
    message: "Server Live ⚡",
  });
});

// middlewares
app.use(globalErrorHandler);
//Not Found
// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    },
  });
});

export default app;
