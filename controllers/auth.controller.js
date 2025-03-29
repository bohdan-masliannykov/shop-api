import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jws from "jsonwebtoken";
import Cart from "../models/cart.js";
import { AppError, throwError } from "../utils/appError.util.js";

const verifyMergeCarts = async (req, res, user) => {
  const { guestId } = req.cookies;

  if (guestId) {
    const cart = await Cart.findOne({ userId: guestId });
    if (cart) {
      cart.userId = user._id;
      await cart.save();
    }
    res.clearCookie("guestId");
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return throwError(400, "Wrong credentials");
    }

    if (!user?.verified) {
      return throwError(
        403,
        "Please verify your e-mail address to continue using the system!"
      );
    }

    const token = jws.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    await verifyMergeCarts(req, res, user);

    res.cookie("jwt", token, { httpOnly: true, secure: true, maxAge: 3600000 });
    res.status(200).json({ message: "Successfully logged in!" });
  } catch (error) {
    next(error);
  }
};

//TODO (incorrect placement???) move it somewhere
const getPersonalData = async (req, res, next) => {
  const { userId } = req.user;

  try {
    const user = await User.findById(userId);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

const logout = (req, res, next) => {
  res.clearCookie("jwt");
  res.status(200).json({ message: "Logged out successfully" });
};

const register = async (req, res, next) => {
  //1. create user DONE
  //2. generate JWT DONE
  //3. add verification mail - later  IN PROGRESS
  try {
    const { name, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashPassword });

    const verificationToken = user.generateVerificationToken();
    await user.save();

    //TODO something with verificationToken (send the link by e-mail mb)
    res.status(201).json({ message: "User has been successfully created!" });
  } catch (error) {
    //TODO verify how error handlers work in MongoDB
    if (error.code === 11000) {
      return next(new AppError(400, "Email is already in use!"));
    }
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({
      verificationToken: token,
      verificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return throwError(400, "Invalid or expired verification token");
    }

    await user.vefiryUserEmail();

    res.status(200).json({ message: "E-mail verified successfully!" });
  } catch (error) {
    next(error);
  }
};

const sendUserVerification = async (req, res, next) => {
  // 1. get user email
  // 2. search for the user in db
  // 3. generate new verification token and expiration token
  // 4. send the link by e-mail

  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user?.verified) {
      await user.generateVerificationToken();
    }

    //TODO send rate-limit
    //TODO send verification link
    res.status(200).json({
      message:
        "If your account exists, you will soon receive an email with a verification link!",
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.query;
    const { password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetExpires: { $gt: Date.now() },
    });

    if (user) {
      await user.updatePassword(password);
      return res
        .status(200)
        .json({ message: "Password successfully has been updated!" });
    }

    return throwError(400, "Invalid or expired reset token!");
  } catch (error) {
    next(error);
  }
};

const sendUserPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      await user.generateResetToken();
    }

    //TODO send rate-limit
    //TODO send verification link
    res.status(200).json({
      message:
        "If your account exists, you will soon receive an email with a reset link!",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  login,
  logout,
  register,
  getPersonalData,
  sendUserVerification,
  sendUserPasswordReset,
  verifyEmail,
  resetPassword,
};
