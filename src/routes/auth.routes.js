import { Router } from "express";
import { registerUser } from "../controllers/auth.controller.js";
import { registerValidate } from "../validator/reg.validate.js";

const authRouter = Router()

authRouter.post("/register", registerValidate, registerUser)

export default authRouter