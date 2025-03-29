import express from "express";
import ProductController from "../controllers/products.controller.js";
import verifyToken from "../middlewares/verifyToken.middleware.js";
import verifyRole from "../middlewares/verifyRole.middleware.js";

const router = express.Router();

router.get("/", ProductController.getProducts);
router.get("/:id", ProductController.getProductById);

router.post(
  "/",
  verifyToken,
  verifyRole(["admin"]),
  ProductController.createProduct
);

router.put(
  "/:id",
  verifyToken,
  verifyRole(["admin"]),
  ProductController.updateProduct
);

router.delete(
  "/:id",
  verifyToken,
  verifyRole(["admin"]),
  ProductController.deleteProduct
);

export default router;
