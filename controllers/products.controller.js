import Product from "../models/product.js";
import { throwError } from "../utils/appError.util.js";
import { getErrorMessage } from "../utils/getErrorMessage.util.js";

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.json({ records: products, total: products.length });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return throwError(404, "Product not found");
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  const { name, price, description } = req.body;

  try {
    const newProduct = new Product({
      name,
      price,
      description,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    if (error.name === "ValidationError") {
      return throwError(400, getErrorMessage(error.message));
    }
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;
    const product = await Product.findByIdAndUpdate(
      id,
      { name, price, description },
      { new: true }
    );

    if (!product) {
      return throwError(404, "Product not found");
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return throwError(404, "Product not found");
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
