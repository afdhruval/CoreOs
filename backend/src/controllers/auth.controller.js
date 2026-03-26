import userModel from "../model/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

// Utility for URL generation
const getUrlPrefix = (type) => {
    if (type === 'frontend') return process.env.FRONTEND_URL || 'http://localhost:5173';
    return process.env.BACKEND_URL || 'http://localhost:3000';
};

export async function register(req, res) {
    try {
        const { username, email, password } = req.body;
        const isUserAlreadyExists = await userModel.findOne({ $or: [{ email }, { username }] });

        if (isUserAlreadyExists) {
            return res.status(400).json({ message: "User with this email or username already exists", success: false });
        }

        const user = await userModel.create({ username, email, password });
        const emailVerificationToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const verificationUrl = `${getUrlPrefix('backend')}/api/auth/verify?token=${emailVerificationToken}`;

        await sendEmail({
            to: email,
            subject: "Welcome to COREOS - Verify Your Account",
            html: `
            <div style="background-color: #0c0d0d; border: 1px solid #222; border-radius: 20px; padding: 48px; text-align: center; max-width: 440px; margin: 60px auto; font-family: 'Inter', sans-serif;">
                <h1 style="color: #fff; font-size: 28px; margin-bottom: 24px;">Confirm Your Identity</h1>
                <p style="color: #888; font-size: 15px; margin-bottom: 40px;">Welcome to <strong style="color: #fff;">COREOS</strong>, ${username}. Click below to unlock your workspace.</p>
                <a href="${verificationUrl}" style="background-color: #22d3ee; color: #000; padding: 14px 44px; border-radius: 10px; text-decoration: none; font-weight: 700; display: inline-block;">Verify Account</a>
            </div>`
        });

        res.status(201).json({ message: "Check email for verification link.", success: true });
    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ message: "Registration failed", success: false });
    }
}

export async function verifyEmail(req, res) {
    try {
        const { token } = req.query;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findOne({ email: decoded.email });

        if (!user) return res.status(400).send("<h1>Verification failed</h1>");

        user.verified = true;
        await user.save();

        res.send(`
        <div style="background-color: #0c0d0d; color: #fff; height: 100vh; display: flex; align-items: center; justify-content: center; font-family: sans-serif; text-align: center;">
            <div style="border: 1px solid #222; padding: 40px; border-radius: 20px;">
                <h1>Verified!</h1>
                <p style="color: #888; margin-bottom: 30px;">Your COREOS identity is confirmed.</p>
                <a href="${getUrlPrefix('frontend')}/login" style="background: #22d3ee; color: #000; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 700;">Login Now</a>
            </div>
        </div>`);
    } catch (err) {
        res.status(400).send("<h1>Link Expired</h1>");
    }
}

export async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        console.log("Login attempt for:", email);

        const user = await userModel.findOne({ email });
        if (!user) {
            console.log("User not found:", email);
            return res.status(401).json({ message: "Invalid email or password", success: false });
        }

        // Fix for existing users: If they have a password and it's not verified, but we want to allow them (for testing)
        // Actually, user wants "without verify they cant login", so we check verified status.
        if (!user.verified && !user.googleId) {
            console.log("User not verified:", email);
            return res.status(403).json({ message: "Please verify your email before logging in", success: false });
        }

        if (user.googleId && !user.password) {
            return res.status(400).json({ message: "Please login with Google", success: false });
        }

        const ispasswordMatched = await user.comparepassword(password);
        if (!ispasswordMatched) {
            console.log("Password mismatch for:", email);
            return res.status(401).json({ message: "Invalid email or password", success: false });
        }

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET);
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // development
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        console.log("Login successful:", email);
        res.status(200).json({ success: true, user: { id: user._id, username: user.username } });
    } catch (err) {
        console.error("Login Server Error:", err);
        res.status(500).json({ message: "Server error during login", success: false });
    }
}

export async function forgotPassword(req, res) {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found", success: false });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; 
    await user.save();

    await sendEmail({ to: email, subject: "COREOS - Password Reset", html: `<h1>OTP: ${otp}</h1>` });
    res.status(200).json({ message: "OTP sent", success: true });
}

export async function resetPassword(req, res) {
    const { email, otp, newPassword } = req.body;
    const user = await userModel.findOne({ email, otp, otpExpiry: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: "Invalid/Expired OTP", success: false });

    user.password = newPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    res.status(200).json({ message: "Password reset", success: true });
}

export function logout(req, res) {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out", success: true });
}

export async function getMe(req, res) {
    const user = await userModel.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "Not found", success: false });
    res.status(200).json({ success: true, user });
}