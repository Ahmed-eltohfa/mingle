import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../model/User.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js'

export const register = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        if (!name || !username || !email || !password) {
            return res.status(400).json({
                message: 'All fields are required'
            });
        }

        const existingUser = await User.findOne({
            $or: [
                { email: email },
                { username: username }
            ]
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'Email or username already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            username,
            email,
            password: hashedPassword
        });

        // res.status(201).json({
        //     message: 'User registered successfully',
        //     user: {
        //         id: user._id,
        //         name: user.name,
        //         username: user.username,
        //         email: user.email,
        //         bio: user.bio
        //     }
        // });
        successResponse(res, {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
        }, 'User registered successfully', 201);

    } catch (error) {
        errorResponse(res, 'Server error', 500, error.message);
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // res.status(200).json({
        //     message: 'Login successful',
        //     token
        // });
        successResponse(res, { token }, 'Login successful', 200);

    } catch (error) {
        errorResponse(res, 'Server error', 500, error.message);
    }
};