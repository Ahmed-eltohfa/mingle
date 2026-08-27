import express from "express";
import {
  createPost,
  deletePostById,
  getPostById,
  getPosts,
  updatePostById,
  searchPosts,
} from "../controllers/postController.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/", upload.array("media", 5), protect, asyncHandler(createPost));
router.get("/", asyncHandler(getPosts));
router.get("/search", asyncHandler(searchPosts));
router.get("/:postId", asyncHandler(getPostById));

router.patch(
  "/:postId",
  upload.array("media", 5),
  protect,
  asyncHandler(updatePostById),
);
router.delete("/:postId", protect, asyncHandler(deletePostById));

export default router;
