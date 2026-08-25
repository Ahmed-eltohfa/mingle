import Comment from "../model/Comment.js"
import {errorResponse} from "../utils/apiResponse.js"

export const isCommentOwner = async (req, res, next) =>{
    try{
        const {commentId} = req.params
        const comment = await Comment.findById({_id: commentId, isDeleted: false})
        if(!comment) return errorResponse(res, "Commnent Not Found", 404)

        if(String(comment.user) !== String(req.user.id)){
            return errorResponse(res, "Forbidden : Not the owner", 403)
        }

        req.comment = comment
        return next()
    }
    catch(err){
        return errorResponse(res, err.message, 500)
    }
}