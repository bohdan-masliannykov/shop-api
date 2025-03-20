import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import productsRouter from "./routes/product.routes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/products", productsRouter);

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
