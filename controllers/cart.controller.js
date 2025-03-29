import Cart from "../models/cart.js";
import { throwError } from "../utils/appError.util.js";
import getUserId from "../utils/getUserId.util.js";

const getCart = async (req, res, next) => {
  try {
    const userId = getUserId(req);

    const cart = await Cart.findOne({ userId })
      .select("items")
      .populate("items.productId");

    res.json({ items: cart?.items || [] });
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    let userId = getUserId(req);

    if (!userId) {
      userId = `guest_${Date.now()}`;
      res.cookie("guestId", userId, {
        httpOnly: true,
        secure: true,
        maxAge: 3600000,
      });
    }

    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
    await cart.save();
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const userId = getUserId(req);

    const { productId } = req.body;
    const cart = await Cart.findOne({ userId });
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      if (cart.items[itemIndex].quantity > 1) {
        cart.items[itemIndex].quantity -= 1;
      } else {
        cart.items.splice(itemIndex, 1);
      }
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return throwError(404, "Item not found in cart");
    }
  } catch (error) {
    next(error);
  }
};

export default {
  getCart,
  addToCart,
  removeFromCart,
};
