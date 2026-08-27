import express from "express";
import {
  createPost,
  deletePostById,
  getPostById,
  getPosts,
  updatePostById,
  searchPosts,
  likePost,
  unlikePost,
  savePost,
  unsavePost,
  getSavedPosts
} from "../controllers/postController.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/", upload.array("media", 5), protect, asyncHandler(createPost));
router.get("/", protect, asyncHandler(getPosts));
router.get("/search", asyncHandler(searchPosts));
router.get("/saved", protect, asyncHandler(getSavedPosts))
router.get("/:postId", asyncHandler(getPostById));

router.patch(
  "/:postId",
  upload.array("media", 5),
  protect,
  asyncHandler(updatePostById),
);
router.delete("/:postId", protect, asyncHandler(deletePostById));

router.post("/:postId/like", protect, asyncHandler(likePost))
router.delete("/:postId/like", protect, asyncHandler(unlikePost))
router.get("/postId/likes", protect, asyncHandler())

router.post("/:postId/save", protect, asyncHandler(savePost))
router.delete("/:postId/save", protect, asyncHandler(unsavePost))


export default router;
