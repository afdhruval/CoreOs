import { body, validationResult } from "express-validator";

export function validate(req, res, next) {
    const error = validationResult(req)
    if (!error.isEmpty()) {
        return res.status(400).json({
            error: error.array()
        })
        next()
    }
}


export const registerValidate = [
    body("username")
        .trim()
        .notEmpty().withMessage("username is required")
        .isLength({ min: 3, max: 30 }).withMessage("username must be bertween 3 to 30"),

    body("email")
        .trim()
        .notEmpty().withMessage("password is required")
        .isEmail().withMessage("please provide a email"),

    body("password")
        .notEmpty().withMessage("password is required")
        .isLength({ min: 6 }).withMessage("password is atleast has 6 character "),

    validate

]


