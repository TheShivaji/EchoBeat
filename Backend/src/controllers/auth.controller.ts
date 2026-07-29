import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "../config/db.js"
import config from "../config/config.js";

function generateToken (res: Response, id: string){
    const token = jwt.sign(
        {id:id}, 
        config.jwtSecret, 
        {expiresIn: config.jwtCookieExpire as any}
    )
    res.cookie("token",token,{
        httpOnly:true,
        secure:true,
        sameSite:"strict",
        maxAge:60 * 60 * 1000,
    })
}

export const singup = async (req: AuthRequest, res: Response) =>{
    try {
        const { username , email , password } = req.body;

        if(!username || !email || !password){
            return res.status(400).json({message:"Please fill all the details"})
        }

        const findUser = await prisma.user.findUnique({
            where: {email: email},
        })

        if(findUser){
            return res.status(400).json({message:"User already exists"})
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data:{
                username:username,
                email:email,
                password:passwordHash,
            }
        })

        generateToken(res,user.id)

        return res.status(201).json({
            message:"User created successfully",
            user:user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal server error"})
    }
}

export const login = async (req: AuthRequest , res: Response) =>{
    try {
        const {email , password} = req.body

        if(!email || !password){
            return res.status(400).json({message:"Please fill all the details"})
        }

        const user = await prisma.user.findUnique({
            where: {email: email},
        })

        if(!user){
            return res.status(401).json({message:"Invalid credentials"})
        }

        const isPasswordValid = await bcrypt.compare(password , user.password)

        if(!isPasswordValid){
            return res.status(401).json({message:"Invalid credentials"})
        }

        generateToken(res,user.id)

        return res.status(200).json({
            message:"User logged in successfully",
            user:user
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal server error"})
    }
}

export const getMe = async(req: AuthRequest , res: Response) =>{
    try {
        const user = await prisma.user.findUnique({
            where: {id: req.user.id},
        })

        return res.status(200).json(user)
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal server error"})
    }
}