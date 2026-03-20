import { Router } from "express";
import { register } from "../controllers/auth.controller.js";
import { registerValidate } from "../validator/reg.validate.js";
import { verifyEmail } from "../controllers/auth.controller.js";
import { loginUser } from "../controllers/auth.controller.js";
import { getMe } from "../controllers/auth.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const authRouter = Router()

authRouter.post("/register", register)

authRouter.get("/verify", verifyEmail)

authRouter.post("/login", loginUser)

authRouter.get("/getme", authUser, getMe)

export default authRouter