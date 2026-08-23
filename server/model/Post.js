import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 5000
        },

        media: [
            {
                url: {
                    type: String,
                    required: true,
                    trim: true
                },
                type: {
                    type: String,
                    enum: ["image", "video"],
                    required: true
                },
                altText: {
                    type: String,
                    default: "",
                    trim: true,
                    maxlength: 200
                }
            }
        ],

        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        visibility: {
            type: String,
            enum: ["public", "followers", "private"],
            default: "public"
        },

        isDeleted: {
            type: Boolean,
            default: false,
            index: true
        },

        deletedAt: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
);

postSchema.index({ createdAt: -1 });

const Post = mongoose.model("Post", postSchema);

export default Post;
