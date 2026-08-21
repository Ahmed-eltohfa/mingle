import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        // TODO: add user fields
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
