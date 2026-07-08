import Otp from "../dbs/Otp.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../dbs/Users.js";

export const sign_up = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Basic validation
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists (by email or username)
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with that email or username' });
        }

        // Create new user
        const user = new User({
            username,
            email,
            password,
        });

        await user.save(); // password hashed automatically

        // Generate OTP for email verification
        const { otp } = await Otp.createOtp({
            email: user.email,
            purpose: 'verify_email',
            expiresInMinutes: 10,
            ipAddress: req.ip, // if needed
            // userAgent: req.get('User-Agent'),
        });

        // TODO: Send OTP via email (implement email service)
        // e.g., await sendEmail(email, 'Verify your email', `Your OTP is ${otp}`);

        // Respond with success (don't send OTP in response for security)
        res.status(201).json({
            success: true,
            message: 'User created successfully. Please verify your email with the OTP sent.',
            userId: user._id,
        });

    } catch (error) {
        // Handle duplicate key errors specifically
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ message: `${field} already exists` });
        }
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        console.error('Sign up error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



export const login = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // --- 1. Validate input ---
        if ((!email && !username) || !password) {
            return res.status(400).json({ message: 'Email/Username and password are required' });
        }

        // --- 2. Find user by email or username ---
        const user = await User.findOne({
            $or: [
                { email: email?.toLowerCase() },
                { username },
            ],
        }).select('+password'); // include password field (hidden by default)

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // --- 3. Check password ---
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // --- 4. (Optional) Check if email is verified ---
        if (!user.emailVerified) {
            return res.status(403).json({
                success: false,
                message: 'Please verify your email address before logging in',
                needsVerification: true,
                email: user.email,
            });
        }

        // --- 5. Update last login ---
        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false }); // avoid re‑hashing password

        // --- 6. Generate JWT ---
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                username: user.username,
                role: user.role || 'user',
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' } // adjust as needed
        );

        // --- 7. Set HTTP‑only cookie ---
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: 'lax', // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // --- 8. Send user data (exclude password) ---
        const userData = user.toObject();
        delete userData.password; // remove password even though it's selected

        res.status(200).json({
            message: 'Login successful',
            user: userData,
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const logout = async (req, res) => {
    // Clear cookie or token
};

export const getProfile = async (req, res) => {
    // Return logged-in user
};

export const updateProfile = async (req, res) => {
    // Update name/avatar
};

export const changePassword = async (req, res) => {
    // Verify old password
    // Hash new password
};


