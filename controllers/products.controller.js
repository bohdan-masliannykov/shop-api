import Product from "../models/product.js";
import { getErrorMessage } from "../utils/getErrorMessage.util.js";

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.json({ records: products, total: products.length });
  } catch (error) {
    next();
  }
};

const getProductById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.json(product);
  } catch (error) {
    next();
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
      return res.status(400).json({
        statusCode: 400,
        message: getErrorMessage(error.message),
      });
    }
    next();
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
      return res.status(404).send("Product not found");
    }
    res.json(product);
  } catch (error) {
    next();
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    next();
  }
};

export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
