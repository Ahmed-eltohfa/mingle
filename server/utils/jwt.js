import jwt from "jsonwebtoken";

export const generateAccessToken = (payload) => {
    const secret = process.env.JWT_ACCESS_SECRET || "replace-with-access-secret";
    const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN || "15m";

    return jwt.sign(payload, secret, { expiresIn });
};

export const generateRefreshToken = (payload) => {
    const secret = process.env.JWT_REFRESH_SECRET || "replace-with-refresh-secret";
    const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

    return jwt.sign(payload, secret, { expiresIn });
};

export const verifyAccessToken = (token) => {
    const secret = process.env.JWT_ACCESS_SECRET || "replace-with-access-secret";
    return jwt.verify(token, secret);
};

export const verifyRefreshToken = (token) => {
    const secret = process.env.JWT_REFRESH_SECRET || "replace-with-refresh-secret";
    return jwt.verify(token, secret);
};
