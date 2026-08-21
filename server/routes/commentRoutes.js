import express from "express";
import { createComment, deleteCommentById, getCommentsByPostId, updateCommentById } from "../controllers/commentController.js";

const router = express.Router();

router.post("/", createComment);
router.get("/post/:postId", getCommentsByPostId);
router.patch("/:commentId", updateCommentById);
router.delete("/:commentId", deleteCommentById);

export default router;
