import express from "express";
import { createComment, deleteCommentById, getCommentsByPostId, updateCommentById } from "../controllers/commentController.js";
import asyncHandler from "../utils/asyncHandler.js";
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/", protect, asyncHandler(createComment));
router.get("/post/:postId", asyncHandler(getCommentsByPostId));
router.patch("/:commentId", protect, asyncHandler(updateCommentById));
router.delete("/:commentId", protect, asyncHandler(deleteCommentById));

export default router;
