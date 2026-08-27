import Post from "../model/Post.js";
import { getUploadUrl } from "../middlewares/uploadMiddleware.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import User from "../model/User.js";

export const createPost = async (req, res) => {
  const media = (req.files || []).map((file) => ({
    url: getUploadUrl(file.filename),
    type: file.mimetype.startsWith("video/") ? "video" : "image",
    altText: req.body.altText || "",
  }));
  const author = req.user?.id || req.body.author;
  try {
    let post = await Post.create({
      author,
      content: req.body.content,
      media,
      visibility: req.body.visibility,
    });
    post = await post.populate("author", "name username avatar");
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
      .limit(limit)
      .populate("author", "name username avatar");
    if (!postList.length) {
      return successResponse(res, { message: "No posts found", data: [] }, 200);
    }

    const user = await User.findById(req.user.id).select("savedPosts")
    const savedPosts = user?.savedPosts || []

    const postsWithLikes = postList.map((post) =>({
      ...post.toObject(),
      likeCount: post.likes.length,
      isLiked: post.likes.some(
        (userId) => String(userId) === String(req.user.id)
      ),
      isSaved: user?.savedPosts?.some(
        (postId) => String(postId) === String(post._id)
      ) ?? false,
    }))

    return successResponse(
      res,
      { data: postsWithLikes, page, limit, count: postsWithLikes.length },
      200,
    );
  } catch (err) {
    return errorResponse(res, "failed to fetch data", 500, err.message);
  }
};

export const searchPosts = async (req, res) => {
  try {
    const { q = "" } = req.query;
    const trimmed = q.trim();
    const filter = { isDeleted: false };

    if (trimmed) {
      const safeRegex = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.content = { $regex: safeRegex, $options: "i" };
    }

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .populate("author", "name username avatar");

    return successResponse(res, { data: posts }, 200);
  } catch (err) {
    return errorResponse(res, "Search failed", 500, err.message);
  }
};

export const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;
    const aPost = await Post.find({ _id: postId, isDeleted: false }).populate(
      "author",
      "name username avatar",
    );
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


export const likePost = async(req, res)=>{
  const{postId} = req.params;
  const userId = req.user.id;

  const post = await Post.findOne({_id: postId, isDeleted: false});

  if(!post){
    return errorResponse(res, 'Post Not Found', 404);
  }

  console.log('USER:', userId);
  console.log('LIKES:', post.likes);

  if(post.likes.includes(userId)){
    return errorResponse(res, 'Post already Liked', 400)
  }

  post.likes.push(userId)
  await post.save()
  return successResponse(res,{
    likeCount: post.likes.length,
    isLiked: true
    },
    'Post Liked Successfully',
    200)
};


export const unlikePost = async (req, res)=>{
  const {postId} = req.params;
  const userId = req.user.id;
  const post = await Post.findOneAndUpdate(
                                  {_id: postId, isDeleted: false},
                                  {
                                    $pull: {likes: userId}
                                  },
                                  {new: true}
  );

  if(!post){
    return errorResponse(res, 'Post Not Found', 404)
  }

  return successResponse(res, {
    likeCount: post.likes.length,
    isLiked: false
    },
    "Post Unliked Successfully",
    200)
}


export const savePost = async (req, res) =>{
  try{
    const {postId} = req.params
    const userId = req.user.id

    const post = await Post.findOne({_id: postId, isDeleted: false})
    if(!post){
      return errorResponse(res, "Post Not Found", 404)
    }

    const user = await User.findOneAndUpdate(
      {
        _id: userId,
        savedPosts: {$ne: postId}
      },
      {
        $addToSet:{savedPosts: postId},
      },
      {new: true}
    )
    if(!user){
      return errorResponse(res, "User Not Found", 404)
    }
    return successResponse(res, {postId}, "Post Saved Successfully", 200)
  }
  catch(err){
    return errorResponse(res, err.message, 500)
  }
}


export const unsavePost = async (req, res) =>{
  try{
    const {postId} = req.params
    const userId = req.user.id
    const post = await Post.findOne({_id: postId, isDeleted: false})
    if(!post){
      return errorResponse(res, "Post Not Found", 404)
    }

    const user = await User.findOneAndUpdate(
      {
        _id: userId,
        isDeleted: false
      },
      {
        $pull:{savedPosts: postId},
      },
      {new : true},
    )

    if(!user){
      return errorResponse(res, "User Not Found", 404)
    }

    return successResponse(res, {postId}, "Post Unsaved Successfully", 200)
  }
  catch (err){
    return errorResponse(res, err.message, 500)
  }
}


export const getSavedPosts = async (req, res) =>{
  try{
    const userId = req.user.id

    const user = await User.findById(userId).populate({
      path: "savedPosts",
      match: {isDeleted: false},
      populate: {
        path: "author",
        select: "name username avatar",
      },
    })

    if(!user){
      return errorResponse(res, "User Not Found", 404)
    }

    return successResponse(res, {data: user.savedPosts}, "Saved Posts Succeeded!", 200)
  }
  catch (err){
    return errorResponse(res, "Failed to fetch saved posts", 500, err.message)
  }
}
