import { verifyAccessToken } from "../utils/jwt.js";

export const protect = (req, res, next) => {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: token missing" });
    }

    try {
        const decoded = verifyAccessToken(token);

        // TODO: load user from DB and attach safe user object
        req.user = decoded;

        return next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized: invalid token" });
    }
};

export const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden: admin access required" });
    }

    return next();
};

export const isOwnerOrAdmin = (ownerIdPathParam = "userId") => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const ownerId = req.params[ownerIdPathParam];

        if (req.user.role === "admin" || String(req.user.id) === String(ownerId)) {
            return next();
        }

        return res.status(403).json({ message: "Forbidden" });
    };
};
