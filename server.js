import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import productsRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import userRouter from "./routes/user.routes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(authRoutes);
app.use("/products", productsRouter);
app.use("/cart", cartRouter);
app.use("/users", userRouter);

// TODO rework basic error handlers
app.use("/", (req, res, next) => {
  const statusCode = 500;
  const message = "Server Error";

  res.status(statusCode).json({ message });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, async () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
