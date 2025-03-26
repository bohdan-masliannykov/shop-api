import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true, min: 1 },
});

const CartSchema = new mongoose.Schema(
  {
    items: [CartItemSchema],
    userId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", CartSchema);

export default Cart;
