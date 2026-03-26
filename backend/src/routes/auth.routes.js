import { Router } from "express";
import { register, verifyEmail, loginUser, getMe, forgotPassword, resetPassword, logout } from "../controllers/auth.controller.js";
import { registerValidate } from "../validator/reg.validate.js";
import { authUser } from "../middlewares/auth.middleware.js";
import passport from "../config/passport.js";
import jwt from "jsonwebtoken";

const authRouter = Router()

authRouter.post("/register", registerValidate, register)
authRouter.get("/verify", verifyEmail)
authRouter.post("/login", loginUser)
authRouter.get("/getme", authUser, getMe)
authRouter.post("/forgot-password", forgotPassword)
authRouter.post("/reset-password", resetPassword)
authRouter.get("/logout", logout)

// Google Auth
authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }))

authRouter.get("/google/callback", passport.authenticate("google", { 
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login` 
}), (req, res) => {
    // Generate JWT token for Google user
    const token = jwt.sign({
        id: req.user._id,
        username: req.user.username
    }, process.env.JWT_SECRET)

    res.cookie("token", token, {
        httpOnly: true,
        secure: false, // set to true if using HTTPS
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
    })

    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/`)
})

export default authRouter