import express from "express";

import {
  getCurrentUser,
  getUserById,
  updateUserById,
  searchUsers,
  deleteUser,
} from "../controllers/userController.js";

import { protect, isOwnerOrAdmin } from "../middlewares/authMiddleware.js";
import { upload } from './../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get("/me", protect, getCurrentUser);

router.get("/search", searchUsers);

router
  .route("/:userId")
  .get(protect, getUserById)
  .patch(protect, isOwnerOrAdmin("userId"), upload.single('avatar'), updateUserById)
  .delete(protect, isOwnerOrAdmin("userId"), deleteUser);

export default router;