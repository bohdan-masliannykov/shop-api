import express from "express";
import CartController from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/", CartController.getCart);
router.post("/", CartController.addToCart);
router.delete("/", CartController.removeFromCart);

export default router;
