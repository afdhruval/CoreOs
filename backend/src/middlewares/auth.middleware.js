import jwt from "jsonwebtoken";

export function authUser(req, res, next) {

    const token = req.cookies.token;

    console.log("cookies:", req.cookies);

    if (!token) {
        return res.status(401).json({
            message: "no token provided",
            success: false
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("decoded:", decoded);

        req.user = decoded;

        next();
    } catch (err) {
        console.log("JWT ERROR:", err.message);

        return res.status(401).json({
            message: "unauthorized",
            success: false
        });
    }
}