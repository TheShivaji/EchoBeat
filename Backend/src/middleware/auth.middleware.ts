import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import config from "../config/config.js"

export interface AuthRequest extends Request {
    user?: any;
}

export const authUser = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.token

        if(!token){
            return res.status(401).json({message:"Unauthorized: No token provided"})
        }

        const decodedToken = jwt.verify(token, config.jwtSecret)

        req.user = decodedToken

        next()
    } catch (error: any) {
        // If token verification fails, return 401 (Unauthorized) instead of 500
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Unauthorized: Invalid or expired token" })
        }

        console.log(error);
        return res.status(500).json({message:"Internal server error"})
    }
}