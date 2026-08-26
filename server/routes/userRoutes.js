

import express from "express";

import {
  getCurrentUser,
  getUserById,
  updateUserById,
  searchUsers,
  deleteUser,
} from "../controllers/userController.js";

import { protect,isOwnerOrAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/me", protect, getCurrentUser);

router.get("/search", searchUsers);

router
  .route("/:userId")
  .get(protect,getUserById)
  .patch(protect,isOwnerOrAdmin, updateUserById)
  .delete(protect,isOwnerOrAdmin ,deleteUser);

export default router;