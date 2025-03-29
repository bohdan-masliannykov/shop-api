import express from "express";
import AuthController from "../controllers/auth.controller.js";
import verifyToken from "../middlewares/verifyToken.middleware.js";

const router = express.Router();

router.get("/me", verifyToken, AuthController.getPersonalData);

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);

router.post("/verify-email", AuthController.verifyEmail);
router.post("/verify-retry", AuthController.sendUserVerification);

export default router;
