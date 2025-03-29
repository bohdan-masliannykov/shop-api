import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { throwError } from "../utils/appError.util.js";

const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const _password = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: _password,
      role,
    });

    await user.save();
    res.status(201).json({ message: "User has been created!" });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return throwError(404, "User not found!");
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    await User.findByIdAndUpdate(
      id,
      { name, email, password, role },
      { new: true }
    );

    res.status(201).json({ message: "User has been created!" });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return throwError(404, "User not found!");
    }
    res.status(201).json({ message: "User has been deleted!" });
  } catch (error) {
    next(error);
  }
};

export default {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};
