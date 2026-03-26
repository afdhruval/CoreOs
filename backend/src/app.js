import dotenv from "dotenv";
dotenv.config();
import express from "express";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import morgan from "morgan"
import cors from "cors"
import session from "express-session";
import passport from "./config/passport.js";
import chatRouter from "./routes/chat.routes.js";

const app = express()

app.use(cors({
    origin: [process.env.FRONTEND_URL || "http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"]
}))

app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))
app.use(session({
    secret: process.env.SESSION_SECRET || 'perplexity_secret',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.use("/api/auth", authRouter)
app.use("/auth", authRouter)
app.use("/api/chats", chatRouter)

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Internal Server Error:", err);
    res.status(500).json({
        message: "Internal Server Error",
        success: false,
        error: err.message
    });
});

export default app