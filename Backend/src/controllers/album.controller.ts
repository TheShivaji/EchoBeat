import { prisma } from "../config/db.js"
import type { AuthRequest } from "../middleware/auth.middleware.js"
import type { Response } from "express"

export const createAlbum = async(req:AuthRequest , res:Response) =>{
    try {
        const {artist , imageUrl , title , releaseYear , songs} = req.body

        if(!artist || !imageUrl || !title || !releaseYear || !songs){
            return res.status(400).json({message:"All fields are required"})
        }

        const album = await prisma.album.create({
            data:{
                artist,
                imageUrl,
                title,
                releaseYear,
                songs
            }
        })

        return res.status(201).json({message:"Album created successfully" , album})
    } catch (error) {
        
    }
}