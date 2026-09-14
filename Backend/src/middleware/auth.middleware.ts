import type { Request, Response, NextFunction } from "express"
import { prisma } from "../config/db.js"
import AppError from "../utils/AppError.js"
import asyncHandler from "../utils/asyncHandler.js"

export interface AuthRequest extends Request {
    user?: any;
}

export const authUser = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ message: "Unauthorized: No session provided" });
}

export const userAdmin = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user?.id) throw new AppError("Unauthorized", 401);

    
    const user = await prisma.user.findUnique({
        where: { id: req.user.id }
    });

    if (!user || user.role !== "ADMIN") throw new AppError("Unauthorized: Admin access required", 403);

    next();
});

