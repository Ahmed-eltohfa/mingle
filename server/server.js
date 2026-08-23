import express from "express";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);


//Comment Section
app.use("/api/comments", commentRoutes);

//Middleware
app.use('/', (req, res, next) => {
    res.json({ message: "Welcome to the API" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
