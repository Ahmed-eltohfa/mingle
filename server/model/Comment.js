import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        // TODO: add comment fields
    },
    { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
