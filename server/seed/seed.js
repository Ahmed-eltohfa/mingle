import "dotenv/config"
import mongoose from "mongoose"
import bcrypt from "bcryptjs";

import connectDB from "../config/db.js"

import User from "../model/User.js"
import Post from "../model/Post.js"
import Comment from "../model/Comment.js"

const seedDatabase = async () => {
    try{
        await connectDB()

        console.log("Clearing existing data....")

        await Comment.deleteMany()
        await Post.deleteMany()
        await User.deleteMany()

        console.log("Database Cleared")

        const names = [
            "Ahmed Hassan",
            "Omar Ali",
            "Mohamed Samir",
            "Youssef Adel",
            "Karim Mostafa",
            "Amr Khaled",
            "Mahmoud Tarek",
            "Hassan Ahmed",
            "Omar Hassan",
            "Yassin Mohamed",
            "Ali Mahmoud",
            "Mostafa Adel",
            "Khaled Samy",
            "Tarek Mohamed",
            "Adam Ibrahim"
        ];

        const password = "Password123!";
        const hashedPassword = await bcrypt.hash(password, 10);

        const usersData = names.map((name, index) => {
            const username = name
                .toLowerCase()
                .replace(/\s+/g, "_");

            return {
                name,
                username,
                email: `${username}@example.com`,
                password: hashedPassword,
                role: index === 0 ? "admin" : "user",
                bio: `Hello, I'm ${name}`,
                avatar: `https://i.pravatar.cc/150?img=${index + 1}`
            };
        });

        const users = await User.insertMany(usersData);

        console.log(`Created ${users.length} users`);

        const postContents = [
            "Just started learning backend development and I'm really enjoying the journey.",
            "Building projects is one of the best ways to improve your programming skills.",
            "Today I learned something really interesting about MongoDB.",
            "Working on a new feature for my project. Can't wait to see the final result.",
            "Consistency is more important than motivation when learning programming."
        ]

        const postsData = [];

        users.forEach((user) => {
            for (let i = 0; i < 5; i++) {
                postsData.push({
                    author: user._id,

                    content: `${postContents[i]} — ${user.name}`,

                    media: i === 0
                        ? [
                            {
                                url: `https://picsum.photos/800/600?random=${user._id}-${i}`,
                                type: "image",
                                altText: "Post image"
                            }
                        ]
                        : [],

                    likes: [],

                    visibility:
                        i === 0
                            ? "public"
                            : i === 1
                                ? "followers"
                                : "public",

                    isDeleted: false,
                    deletedAt: null
                });
            }
        });

        const posts = await Post.insertMany(postsData);

        console.log(`Created ${posts.length} posts`);

        for (const post of posts) {
            const shuffledUsers = [...users].sort(() => Math.random() - 0.5);

            const likeCount = Math.floor(Math.random() * 8);

            post.likes = shuffledUsers
                .slice(0, likeCount)
             .map(user => user._id);

            await post.save();
        }

        console.log("Added likes to posts");


        const commentTexts = [
            "Great post! Really useful.",
            "I completely agree with you.",
            "This is interesting. Thanks for sharing!",
            "Nice work! Keep going."
        ];

        const commentsData = [];

        posts.forEach((post, postIndex) => {
            for (let i = 0; i < 4; i++) {
                const user = users[(postIndex + i) % users.length];

                commentsData.push({
                    content: commentTexts[i],
                    user: user._id,
                    post: post._id,
                    parentComment: null,
                    likes: [],
                    isDeleted: false,
                    deletedAt: null
                });
            }
        });

        const comments = await Comment.insertMany(commentsData);

        console.log(`Created ${comments.length} comments`);


        const repliesData = [];

        const replyTexts = [
            "Thanks!",
            "Exactly!",
            "Glad you liked it.",
            "Appreciate your comment!"
        ];

        for (let i = 0; i < comments.length; i += 4) {
            const parentComment = comments[i];

            for (let j = 0; j < 2; j++) {
                const user = users[(i + j + 1) % users.length];

                repliesData.push({
                    content: replyTexts[j],
                    user: user._id,
                    post: parentComment.post,
                    parentComment: parentComment._id,
                    likes: [],
                    isDeleted: false,
                    deletedAt: null
                });
            }
        }

        const replies = await Comment.insertMany(repliesData);

        console.log(`Created ${replies.length} replies`);


        const allComments = [...comments, ...replies];

        for (const comment of allComments) {
            const shuffledUsers = [...users].sort(() => Math.random() - 0.5);

            const likeCount = Math.floor(Math.random() * 6);

            comment.likes = shuffledUsers
                .slice(0, likeCount)
                .map(user => user._id);

            await comment.save();
        }

        console.log("Added likes to comments");



        const commentsToDelete = comments.slice(0, 5);

        for (const comment of commentsToDelete) {
            comment.isDeleted = true;
            comment.deletedAt = new Date();

            await comment.save();
        }

        console.log("Soft deleted 5 comments");

    }
    catch (err){
        console.log("Seed Error", err)
    }
    finally{
        await mongoose.connection.close()
        console.log("MongoDB Connection Closed")
    }
}
seedDatabase()

