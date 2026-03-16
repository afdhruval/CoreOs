import express from "express";
import dotenv from "dotenv"
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";

dotenv.config()
const app = express()

app.use(express.json())
app.use("/api/auth", authRouter)
app.use(cookieParser())

export default app