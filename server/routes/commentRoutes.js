import express from "express";
import { createComment, 
        deleteComment, 
        getCommentsByPostId, 
        updateCommentById,
        likeComment,
        unlikeComment,
        getCommentLikes } from "../controllers/commentController.js";
import asyncHandler from "../utils/asyncHandler.js";
import { protect } from "../middlewares/authMiddleware.js";
import { isCommentOwner } from "../middlewares/commentMiddleware.js";
const router = express.Router();

router.post("/", protect, asyncHandler(createComment));
router.get("/post/:postId", protect, asyncHandler(getCommentsByPostId));
router.patch("/:commentId", protect, isCommentOwner, asyncHandler(updateCommentById));
router.delete("/:commentId", protect, isCommentOwner, asyncHandler(deleteComment));

router.post("/:commentId/like", protect, asyncHandler(likeComment))
router.delete("/:commentId/like", protect, asyncHandler(unlikeComment))
router.get("/:commentId/likes", protect, asyncHandler(getCommentLikes))

export default router;
