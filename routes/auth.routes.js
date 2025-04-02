import express from "express";
import AuthController from "../controllers/auth.controller.js";
import verifyToken from "../middlewares/verifyToken.middleware.js";
import { validateUserSchema } from "../middlewares/validateSchema.middleware.js";
import Joi from "joi";

const router = express.Router();

router.get("/me", verifyToken, AuthController.getPersonalData);

const registerSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email(),
  password: Joi.string().min(8).required(),
});

router.post(
  "/register",
  validateUserSchema(registerSchema),
  AuthController.register
);

const loginSchema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().min(8).required(),
});

router.post("/login", validateUserSchema(loginSchema), AuthController.login);
router.post("/logout", AuthController.logout);

router.post("/verify-email", AuthController.verifyEmail);
router.post("/verify-retry", AuthController.sendUserVerification);

// TODO test
router.post("/reset-password", AuthController.sendUserPasswordReset);
router.post("/set-password", AuthController.resetPassword);

export default router;
