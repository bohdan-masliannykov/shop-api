import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import swaggerUI from "swagger-ui-express";
import swaggerSpec from "./swagger.js";

import authRoutes from "./routes/auth.routes.js";
import productsRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import userRouter from "./routes/user.routes.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.middleware.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use(authRoutes);
app.use("/products", productsRouter);
app.use("/cart", cartRouter);
app.use("/users", userRouter);

app.use(globalErrorHandler);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    const server = app.listen(PORT, async () => {
      console.log(`Server is running on port ${PORT}`);
    });

    server.on("close", () => process.exit(0));
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
