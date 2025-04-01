import Cart from "../models/cart.js";
import User from "../models/user.js";
import Order from "../models/order.js";

import { throwError } from "../utils/appError.util.js";
import { isGuest } from "../utils/isGuest.util.js";
import getUserId from "../utils/getUserId.util.js";

const createOrder = async (req, res, next) => {
  try {
    const { shippingDetails, email } = req.body;
    const userId = getUserId(req);

    if (!userId) {
      return throwError(400, "Cart is Empty!");
    }
    const _isGuest = isGuest(userId);

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "name price",
    });

    if (!cart || !cart.items.length) {
      return throwError(400, "Cart is Empty!");
    }

    if (!_isGuest) {
      const finalUser = await User.findOne({ _id: userId });
      if (!finalUser) {
        return throwError(404, "User not found!");
      }
    }
    const items = cart.items.map(
      ({ productId: { _id, price } = {}, quantity }) => ({
        productId: _id,
        quantity,
        price: price || 0,
      })
    );

    const totalPrice = items.reduce((acc, { quantity, price }) => {
      return acc + quantity * price;
    }, 0);

    const orderData = {
      userId: _isGuest ? undefined : userId,
      email,
      shippingDetails,
      items,
      totalPrice,
    };

    const order = new Order(orderData);
    await order.save();
    await cart.emptyCart();

    //start payment process

    res.status(200).json({ message: "Order has been created!" });
  } catch (error) {
    next(error);
  }
};

export default {
  createOrder,
};
