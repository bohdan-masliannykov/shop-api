import Product from "../models/product.js";
import { getErrorMessage } from "../utils/getErrorMessage.util.js";

const getProducts = async (req, res) => {
  res.send("Get all products");
};

const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};

const createProduct = async (req, res) => {
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
    console.log(error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        statusCode: 400,
        message: getErrorMessage(error.message),
      });
    }
    res.status(500).send("Server error");
  }
};
const updateProduct = async (req, res) => {
  res.send("Update product");
};
const deleteProduct = async (req, res) => {
  res.send("Delete product");
};

export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
