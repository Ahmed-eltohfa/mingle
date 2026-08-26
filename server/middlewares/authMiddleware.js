import { verifyAccessToken } from "../utils/jwt.js";

export const protect = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization || "";
    // console.log(authHeader);
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: token missing" });
    }

    try {
        const decoded = verifyAccessToken(token);

        // console.log(decoded);
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

export const isOwnerOrAdmin = (ownerIdParam = "id") => {
    return (req, res, next) => {
        // 1. Ensure `protect` middleware ran before this
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: Authentication required" });
        }

        // 2. Get target resource ID from URL params (e.g., req.params.id)
        const resourceOwnerId = req.params[ownerIdParam];

        if (!resourceOwnerId) {
            return res.status(400).json({
                message: `Bad Request: Route parameter '${ownerIdParam}' was not provided`
            });
        }

        // 3. Normalize current user ID (handles Mongoose ObjectId vs String)
        const currentUserId = req.user._id ? req.user._id.toString() : req.user.id;

        const isAdmin = req.user.role === "admin";
        const isOwner = currentUserId === resourceOwnerId.toString();

        // 4. Grant access if Admin or Owner
        if (isAdmin || isOwner) {
            return next();
        }

        // 5. Block access if neither
        return res.status(403).json({ message: "Forbidden: You do not have permission" });
    };
};