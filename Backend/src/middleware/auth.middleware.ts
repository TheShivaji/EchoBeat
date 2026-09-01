import type { Request, Response, NextFunction } from "express"
import { prisma } from "../config/db.js"

export interface AuthRequest extends Request {
    user?: any;
}

export const authUser = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ message: "Unauthorized: No session provided" });
}

export const userAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // DB se fresh user fetch karo taaki real-time role check ho
        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        })

        if (!user || user.role !== "ADMIN") {
            return res.status(403).json({ message: "Unauthorized: Admin access required" })
        }

        next()
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal server error"})
    }
}