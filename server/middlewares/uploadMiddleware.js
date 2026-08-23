import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { errorResponse } from "../utils/apiResponse.js";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const uploadDirectory = path.resolve(currentDirectory, "../uploads");

fs.mkdirSync(uploadDirectory, { recursive: true });

const allowedMimeTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "video/mp4",
    "video/webm",
    "video/quicktime"
]);

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, uploadDirectory);
    },
    filename: (req, file, callback) => {
        const extension = path.extname(file.originalname).toLowerCase();
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
        callback(null, uniqueName);
    }
});

const fileFilter = (req, file, callback) => {
    if (allowedMimeTypes.has(file.mimetype)) {
        return callback(null, true);
    }

    return callback(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "media"));
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024,
        files: 5
    }
});

export const uploadErrorHandler = (error, req, res, next) => {
    if (!(error instanceof multer.MulterError)) {
        return next(error);
    }

    const message = error.code === "LIMIT_FILE_SIZE"
        ? "Each uploaded file must be 50 MB or smaller"
        : error.code === "LIMIT_FILE_COUNT"
            ? "You can upload a maximum of 5 files"
            : "Only image and video files are allowed";

    return errorResponse(res, message, 400, error.message);
};

export const getUploadUrl = (filename) => `/uploads/${filename}`;
