import userModel from "../model/user.model.js";
import jwt from "jsonwebtoken";

export async function registerUser(req, res) {

    const { username, email, password } = req.body

    const isUserAlredyExits = await userModel.findOne({
        $or: [
            { username }, { email }
        ]
    })

    if (isUserAlredyExits) {
        return res.status(409).json({
            message: "user already exits",
            success: false,
            err: "user already exits"
        })
    }

    const user = await userModel.create({
        username, email, password
    })  

    



}


