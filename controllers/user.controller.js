import User from "../models/user.js";
import bcrypt from "bcryptjs";

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
    next();
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    next();
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { name, email, password, role },
      { new: true }
    );

    res.status(201).json({ message: "User has been created!" });
  } catch (error) {
    next();
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }
    res.status(201).json({ message: "User has been deleted!" });
  } catch (error) {
    next();
  }
};

export default {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};
