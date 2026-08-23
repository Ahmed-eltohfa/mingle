import Comment from "../model/Comment.js" 
import {successResponse, errorResponse} from "../utils/apiResponse.js"

export const createComment = async(req, res) => {
    try{
        const{content, user, post} = req.body
        const comment = await Comment.create({
            content,
            user,
            post
        })
        return successResponse(res, comment, "Comment created successfullty", 201)
    }
    catch{err}{
        return errorResponse(res, "Failed to add Comment", 500, err.message)
    }
};


export const getCommentsByPostId = async(req, res) => {
    try{
        const {postId} = req.params
        const comments = await Comment.find({post: postId, isDeleted: false}).sort({createdAt: -1})
        return successResponse(res, comments, "All comments")
    } 
    catch(err){
        return errorResponse(res, "Failed to get Comments", 500, err.message)
    }
    
};


export const updateCommentById = async(req, res) => {
    try{
        const {id} = req.params
        const {content} = req.body
        const comment = await Comment.findOneAndUpdate(
            {
                _id: id,
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


export const deleteCommentById = async(req, res) => {
    try{
        const {id} = req.params
        const comment = await Comment.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false
            },
            {
                isDeleted: true,
                deletedAt: new Date()
            },
            {new : true}
        )
        if(!comment){
            return errorResponse(res, "Comment Not Found", 404)
        }
        return successResponse(res, null, "Comment Deleted Successfully", 204)
    }
    catch(err){
        return errorResponse(res, "Failed to delete Comment", 500, err.message)
    }
};
