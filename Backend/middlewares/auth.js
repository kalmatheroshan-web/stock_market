import jwt from "jsonwebtoken";
import User from "../dbs/Users.js";

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        console.log(req.cookies.token); //undifine
        console.log(req.headers.cookie); //undefine
        if (!token) {
            return res.status(200).json({
                success: false,
                msg : "hello",
                token: req.cookie.token,
                header: req.headers.cookie,
                message: "No token provided.",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found.",
            });
        }

        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });
    }
};

export default authMiddleware;