import express from "express";
import { createPost, deletePostById, getPostById, getPosts, updatePostById } from "../controllers/postController.js";

const router = express.Router();

router.post("/", createPost);
router.get("/", getPosts);
router.get("/:postId", getPostById);
router.patch("/:postId", updatePostById);
router.delete("/:postId", deletePostById);

export default router;
