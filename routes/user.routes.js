import express from "express";
import UserController from "../controllers/user.controller.js";
import verifyToken from "../middlewares/verifyToken.middleware.js";
import verifyRole from "../middlewares/verifyRole.middleware.js";

const router = express.Router();

router.post("/", verifyToken, verifyRole(["admin"]), UserController.createUser);

router.get(
  "/:id",
  verifyToken,
  verifyRole(["admin"]),
  UserController.getUserById
);

router.put(
  "/:id",
  verifyToken,
  verifyRole(["admin"]),
  UserController.updateUser
);

router.delete(
  "/:id",
  verifyToken,
  verifyRole(["admin"]),
  UserController.deleteUser
);

export default router;
