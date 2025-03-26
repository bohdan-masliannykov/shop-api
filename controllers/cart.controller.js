import Cart from "../models/cart.js";

const getCart = async (req, res, next) => {
  try {
    //todo add userId to request object
    const mockUserId = "60f1b3b6f3f4f3b3b4b3b4b3";
    const cart = await Cart.findOne({ userId: mockUserId })
      .populate("items.productId")
      .lean();
    res.json(cart);
  } catch (error) {
    next();
  }
};

const addToCart = async (req, res, next) => {
  try {
    //todo add userId to request object
    const mockUserId = "60f1b3b6f3f4f3b3b4b3b4b3";
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ userId: mockUserId });

    if (!cart) {
      cart = new Cart({
        userId: mockUserId,
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
    next();
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    //todo add userId to request object
    const mockUserId = "60f1b3b6f3f4f3b3b4b3b4b3";
    const { productId } = req.body;
    const cart = await Cart.findOne({ userId: mockUserId });
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
      return res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    next();
  }
};

export default {
  getCart,
  addToCart,
  removeFromCart,
};
