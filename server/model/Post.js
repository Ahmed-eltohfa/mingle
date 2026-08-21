import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        // TODO: add post fields
    },
    { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
