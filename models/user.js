import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { generateExpirationToken } from "../utils/generateExpirationToken.util.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    // #region used for E-mail verification
    verified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    verificationExpires: {
      type: Date,
    },
    // #endregion

    // #region used for password reset
    resetToken: {
      type: String,
    },
    resetExpires: {
      type: Date,
    },
    // #endregion
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateVerificationToken = async function () {
  const { token, expiritationDate } = generateExpirationToken();
  this.verificationToken = token;
  this.verificationExpires = expiritationDate;
  return this.save();
};

userSchema.methods.generateResetToken = async function () {
  const { token, expiritationDate } = generateExpirationToken();
  this.resetToken = token;
  this.resetExpires = expiritationDate;
  return this.save();
};

userSchema.methods.vefiryUserEmail = function () {
  this.verified = true;
  this.verificationToken = null;
  this.verificationExpires = null;
  return this.save();
};

userSchema.methods.updatePassword = async function (password) {
  const hashPassword = await bcrypt.hash(password, 10);
  this.password = hashPassword;
  this.resetToken = null;
  this.resetExpires = null;
  return this.save();
};

const User = mongoose.model("User", userSchema);

export default User;
