import express from "express";
import AuthController from "../controllers/auth.controller.js";
import userAuth from "../middlewares/user-auth.middleware.js";

const router = express.Router();

router.get("/me", userAuth, AuthController.getPersonalData);
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);

export default router;
