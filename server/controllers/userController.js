
import User from "../model/User.js";
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// GET current logged-in user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || user.isDeleted) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

// GET user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user || user.isDeleted) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    return errorResponse(res, 500, `Server error: ${error.message}`);
  }
};

// UPDATE user
export const updateUserById = async (req, res) => {
  try {
    // 1. Safe ID lookup (fall back to req.params.id if userId is undefined)
    const userId = req.params.userId || req.params.id;

    if (!userId) {
      return res.status(400).json({ message: "Bad Request: User ID is required" });
    }

    const { name, username, bio } = req.body;

    // 2. Build update object dynamically to prevent overwriting values with undefined
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (username !== undefined) updateData.username = username;
    if (bio !== undefined) updateData.bio = bio;

    // 3. Handle avatar upload from Multer (if file was attached)
    if (req.file) {
      // Formats file path to match your static uploads endpoint
      updateData.avatar = `/uploads/${req.file.filename}`;
    }

    // 4. Update user in DB
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).select('-password');

    if (!user || user.isDeleted) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 5. Return success matching your standard user object structure
    return res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update User Error:", error);

    // Handle invalid MongoDB ObjectId string gracefully
    if (error.name === 'CastError') {
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    return res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

// SEARCH users
export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const users = await User.find({
      isDeleted: false,
      $or: [
        { username: { $regex: q, $options: "i" } },
        { name: { $regex: q, $options: "i" } },
      ],
    }).select("-password");

    return res.status(200).json({
      users,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

// DELETE user (Soft Delete)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      {
        isDeleted: true,
      },
      {
        new: true,
      }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};