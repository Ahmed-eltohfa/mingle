import Comment from "../model/Comment.js" 
import Post from "../model/Post.js"
import {successResponse, errorResponse} from "../utils/apiResponse.js"

export const createComment = async(req, res) => {
    try{
        const{content, post, parentComment} = req.body
        const user = req.user.id

        //check if post is existed
        const postExists = await Post.findOne({
            _id: post,
            isDeleted: false
        })

        if(!postExists){
            return errorResponse(res, "Post Not Found", 404)
        }

        if(parentComment){
            const parent = await Comment.findOne({
                _id: parentComment,
                isDeleted: false
            })
            
            if(!parent){
                return errorResponse(res, "Parent Comment Not Found", 404)
            }

            if(String(parent.post) !== String(post)){
                return errorResponse(res, "Parent Comment doesn't belong to this Post", 400)
            }
            
            if(parent.parentComment){
                return errorResponse(res, "Replies to replies are not allowed", 400)
            }
        }
        const comment = await Comment.create({
            content,
            user,
            post,
            parentComment: parentComment || null
        })
        return successResponse(res, comment, "Comment created successfullty", 201)
    }
    catch (err){
        return errorResponse(res, "Failed to add Comment", 500, err.message)
    }
};


export const getCommentsByPostId = async(req, res) => {
    try{
        const {postId} = req.params
        const comments = await Comment.find({
            post: postId, 
            isDeleted: false
            })
        .sort({createdAt: -1})
        .populate("user", "username avatar")

        const mainComments = comments.filter(comment => !comment.parentComment)
        const replies = comments.filter(reply => reply.parentComment)

        const result = mainComments.map(comment => {
            const commentReplies = replies.filter(
                reply => String(reply.parentComment) === String(comment._id))
            
            return {
                ...comment.toObject(),
                likesCount: comment.likes.length,
                isLiked: comment.likes.some(
                    userId => String(userId) === String(req.user.id)
                ),
                replies: commentReplies.map(reply =>({
                    ...reply.toObject(),
                    likesCount: reply.likes.length,
                    isLiked: reply.likes.some(
                        userId => String(userId) === String(req.user.id)
                    )
                }))
            }
        })
        return successResponse(res, result, "All comments")
    } 
    catch(err){
        return errorResponse(res, "Failed to get Comments", 500, err.message)
    }
    
};


export const updateCommentById = async(req, res) => {
    try{
        const {commentId} = req.params
        const {content} = req.body
        const comment = await Comment.findOneAndUpdate(
            {
                _id: commentId,
                isDeleted: false
            },
            {content},
            {
                new: true,
                runValidators: true
            }
        )
        if(!comment){
            return errorResponse(res, "Comment not Found", 404)
        }

        return successResponse(res, comment, "Comment Updated!")
    
    }
    catch(err){
        return errorResponse(res, "Failed to Update Comment", 500, err.message)
    }
};


export const deleteComment = async(req, res) => {
    try{
        // const comment = await Comment.findOneAndUpdate(
        //     {
        //         _id: id,
        //         isDeleted: false
        //     },
        //     {
        //         isDeleted: true,
        //         deletedAt: new Date()
        //     },
        //     {new : true}
        //)
        const comment = req.comment
        comment.isDeleted = true
        comment.deletedAt = new Date()
        await comment.save()
        return successResponse(res, null, "Comment Deleted Successfully", 200)
    }
    catch(err){
        return errorResponse(res, "Failed to delete Comment", 500, err.message)
    }
};


export const likeComment = async(req, res)=>{
    try{
        const {commentId} = req.params
        const userId = req.user.id

        const comment = await Comment.findOne({
            _id: commentId,
            isDeleted: false
        })

        if(!comment){
            return errorResponse(res, "Comment Not Found", 404)
        }

        const alreadyLiked = comment.likes.some(
            (id) => id.toString() === userId.toString()
        )
        if(alreadyLiked){
            return errorResponse(res, "AlreadyLiked", 409)
        }

        comment.likes.push(userId)
        await comment.save()
        return successResponse(
            res,
            {
                likesCount: comment.likes.length,
            },
            "Comment Liked Successfully",
            200
        )
    }
    catch(err){
        return errorResponse(res, err.message, 500)
    }
}



export const unlikeComment = async (req, res) =>{
    try{
        const {commentId} = req.params
        const userId = req.user.id

        const comment = await Comment.findOne({
            _id: commentId,
            isDeleted: false
        })

        if(!comment){
            return errorResponse(res, "Comment Not Found", 404)
        }
        
        comment.likes = comment.likes.filter(
            (id) => id.toString() !== userId.toString()
        )
        await comment.save()

        return successResponse(res, 
            {
                likesCount: comment.likes.length
            },
            "Comment Unliked Successfully",
            200
        )
    }
    catch(err){
        return errorResponse(res, err.message, 500)
    }
}


export const getCommentLikes = async (req, res)=>{
    try{
        const {commentId} = req.params
        const comment = await Comment.findOne({
            _id: commentId,
            isDeleted: false
        }).populate("likes", "username avatar")

        if(!comment){
            return errorResponse(res, "Comment Not Found", 404)
        }

        return successResponse(res, 
            {
                likesCount: comment.likes.length,
                users: comment.likes,
            },
            "Comment Likes Retrieved Successfully",
            200
        )
    }
    catch(err){
        return errorResponse(res, err.message, 500)
    }
}



