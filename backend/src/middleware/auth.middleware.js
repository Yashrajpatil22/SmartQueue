import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const verifyJWT = async (req, res, next) => {
    try{
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if(!token){
            return res.status(401).json({ message: "Unauthorized access" });
        }
        const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(data._id).select("-password -refreshToken");
        if(!user){
            return res.status(401).json({ message: "Invalid Access Token" });
        }
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: error?.message || "Something went wrong" });
    }
}

export default verifyJWT;