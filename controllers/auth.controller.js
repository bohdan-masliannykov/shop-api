import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jws from "jsonwebtoken";

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Wrong credentials" });
    }

    const token = jws.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("jwt", token, { httpOnly: true, secure: true, maxAge: 3600000 });
    res.status(200).json({ jwt: token });
  } catch (error) {
    next();
  }
};

const getPersonalData = async (req, res, next) => {
  const { userId } = req.user;

  try {
    const user = await User.findById(userId);
    res.status(200).json({ user });
  } catch (error) {
    next();
  }
};

const logout = (req, res, next) => {
  res.json({ message: "Logout" });
};

const register = async (req, res, next) => {
  //1. create user
  //2. generate JWT
  //3. add verification mail - later
  try {
    const { name, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashPassword });
    await user.save();
    res.status(201).json({ message: "User has been successfully created!" });
  } catch (error) {
    console.log(error);
    next();
  }
};

export default {
  login,
  logout,
  register,
  getPersonalData,
};
