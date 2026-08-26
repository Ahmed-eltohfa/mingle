import Post from "../model/Post.js";
import { getUploadUrl } from "../middlewares/uploadMiddleware.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";

export const createPost = async (req, res) => {
    const media = (req.files || []).map((file) => ({
        url: getUploadUrl(file.filename),
        type: file.mimetype.startsWith("video/") ? "video" : "image",
        altText: req.body.altText || "",
    }));
    const author = req.user?.id || req.body.author;
    try {
        const post = await Post.create({
            author,
            content: req.body.content,
            media,
            visibility: req.body.visibility,
        });
        return successResponse(res, post, "Post created successfully", 201);
    } catch (err) {
        return errorResponse(res, "Failed to create post", 500, err.message);
    }
};

export const getPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const postList = await Post.find({ isDeleted: false })
            .sort({
                createdAt: -1,
            })
            .skip(skip)
            .limit(limit);
        if (!postList.length) {
            return successResponse(res, { message: "No posts found", data: [] }, 200);
        }

        return successResponse(
            res,
            { data: postList, page, limit, count: postList.length },
            200,
        );
    } catch (err) {
        return errorResponse(res, "failed to fetch data", 500, err.message);
    }
};

export const getPostById = async (req, res) => {
    try {
        const { postId } = req.params;
        const aPost = await Post.find({ _id: postId, isDeleted: false });
        if (!aPost || aPost.length === 0) {
            return errorResponse(res, "Post not found or was deleted", 404);
        }
        return successResponse(res, aPost, 200);
    } catch (err) {
        return errorResponse(res, "failed to fetch 1data", 500, err.message);
    }
};

export const updatePostById = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content, visibility } = req.body;

        const updateFields = {};
        if (content !== undefined) updateFields.content = content;
        if (visibility !== undefined) updateFields.visibility = visibility;

        // Only touch media if new files were actually uploaded — otherwise
        // this used to wipe existing media on every caption-only edit.
        if (req.files?.length) {
            updateFields.media = req.files.map((file) => ({
                url: getUploadUrl(file.filename),
                type: file.mimetype.startsWith("video/") ? "video" : "image",
                altText: req.body.altText || "",
            }));
        }

        const updatedPost = await Post.findOneAndUpdate(
            { _id: postId, isDeleted: false },
            updateFields,
            { new: true, runValidators: true },
        );
        if (!updatedPost) {
            return errorResponse(res, "Post not found or was deleted", 404);
        }
        return successResponse(res, updatedPost, "Post updated successfully");
    } catch (err) {
        return errorResponse(res, "Failed to update post", 500, err.message);
    }
};

export const deletePostById = async (req, res) => {
    try {
        const { postId } = req.params;
        const updatedPost = await Post.findOneAndUpdate(
            { _id: postId, isDeleted: false },
            { isDeleted: true, deletedAt: new Date() },
            { new: true, runValidators: true },
        );
        if (!updatedPost) {
            return errorResponse(res, "Post not found or was deleted", 404);
        }
        return successResponse(res, updatedPost, "Post deleted successfully");
    } catch (err) {
        return errorResponse(res, "Failed to delete post", 500, err.message);
    }
};
