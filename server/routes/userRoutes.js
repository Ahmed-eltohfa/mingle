import express from "express";
import { getCurrentUser, getUserById, updateUserById } from "../controllers/userController.js";

const router = express.Router();

router.get("/me", getCurrentUser);
router.get("/:userId", getUserById);
router.patch("/:userId", updateUserById);

export default router;
