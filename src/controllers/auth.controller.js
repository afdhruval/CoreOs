import userModel from "../model/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

export async function registerUser(req, res) {

    console.log("STEP 1");

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


    console.log("STEP 2");

    try {
        await sendEmail({
            to: email,
            subject: "welcome to the persplexity",
            html: "hi thank you for registering to the perplexity",
        });
    } catch (err) {
        console.log("Mail failed but user created");
    }

    console.log("STEP 3");
    res.status(201).json({
        messsage: "user registered successfully",
        success: true,
        user: {
            id: user._id,
            name: user.username,
            email: user.email
        }
    })




}


