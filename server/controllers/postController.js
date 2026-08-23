import Post from "../model/Post.js";
import { getUploadUrl } from "../middlewares/uploadMiddleware.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";

export const createPost = async (req, res) => {
    const media = (req.files || []).map((file) => ({
        url: getUploadUrl(file.filename),
        type: file.mimetype.startsWith("video/") ? "video" : "image",
        altText: req.body.altText || ""
    }));

    const author = req.user?.id || req.body.author;

    try {
        const post = await Post.create({
            author,
            content: req.body.content,
            media,
            visibility: req.body.visibility
        });
        return successResponse(res, post, "Post created successfully", 201);
    } catch (error) {
        return errorResponse(res, "Failed to create post", 500, error.message);
    }
};

export const getPosts = async (req, res) => {
    // TODO: implement get posts logic
};

export const getPostById = async (req, res) => {
    // TODO: implement get post by id logic
};

export const updatePostById = async (req, res) => {
    // TODO: implement update post logic
};

export const deletePostById = async (req, res) => {
    // TODO: implement delete post logic
};
