import userModel from "../model/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

export async function register(req, res) {



    const { username, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{ email }, { username }]
    })

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "User with this email or username already exists",
            success: false,
            err: "User already exists"
        })
    }

    const user = await userModel.create({ username, email, password })


    const emailVerificationToken = jwt.sign({
        email: user.email,
    }, process.env.JWT_SECRET)

    await sendEmail({
        to: email,
        subject: "Welcome to Perplexity!",
        html: `
                <p>Hi ${username},</p>
                <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
                <p>Please verify your email address by clicking the link below:</p>
                <p>Please verify your email address by clicking the link below:</p>
                <p>Please verify your email address by clicking the link below:</p>
                <a href="http://localhost:3000/api/auth/verify?token=${emailVerificationToken}">Verify Email</a>
                <p>If you did not create an account, please ignore this email.</p>
                <p>Best regards,<br>The Perplexity Team</p>
        `
    })

    res.status(201).json({
        message: "User registered successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });



}

export async function verifyEmail(req, res) {

    const { token } = req.query

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await userModel.findOne({
        email: decoded.email
    })

    if (!user) {
        return res.status(400).json({
            message: "invalide token",
            success: false,
            err: "user not found "
        })
    }

    user.verified = true

    await user.save()

    const html = (`
        <h1>email verified successfully</h1>
        <p>your email has been verified. you can go to your login account .</p>
        <a href="http://localhost:3000/login"> go to loign </a>
        `)

    res.send(html)

}

export async function loginUser(req, res) {

    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(401).json({
            message: "inavlid email and password",
            success: false
        })
    }

    const ispasswordMatched = await user.comparepassword(password)

    if (!ispasswordMatched) {
        return res.status(401).json({
            message: "password does nor matched",
            success: false
        })
    }

    if (!user.verified) {
        return res.status(400).json({
            message: "please verify email before login user",
            success: false
        })
    }

    const token = jwt.sign({
        id: user._id,
        username: user.username
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(200).json({
        message: "login successfull",
        success: true,
        user: {
            id: user._id,
            username: user.username
        }
    })
}

export async function getMe(req,res){
    const userId = req.user.id


    const user = await userModel.findById(userId).select("-password")

    if(!user){
        return res.status(404).json({
            message : "user not found",
            success :  false,
            err : "user not found"
        })
    }

    res.status(200).json({
        message : "user details fetched successfully",
        sucess : true,
        user
    })
}