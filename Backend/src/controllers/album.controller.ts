import { prisma } from "../config/db.js"
import type { AuthRequest } from "../middleware/auth.middleware.js"
import type { Response } from "express"

export const createAlbum = async(req:AuthRequest , res:Response) =>{
    try {
        const {artistId , imageUrl , title , releaseYear } = req.body

        if(!artistId || !imageUrl || !title || !releaseYear ){
            return res.status(400).json({message:"All fields (including artistId) are required"})
        }

        const parsedReleaseYear = parseInt(releaseYear, 10);
        if (isNaN(parsedReleaseYear)) {
            return res.status(400).json({ message: "Release year must be a valid number" });
        }

        // Verify artist exists
        const artistExists = await prisma.artist.findUnique({ where: { id: String(artistId) } });
        if (!artistExists) {
            return res.status(404).json({ message: "Artist not found" });
        }

        const album = await prisma.album.create({
            data:{
                title,
                imageUrl,
                releaseYear: parsedReleaseYear,
                artists: {
                    connect: { id: String(artistId) }
                }
            }
        })

        return res.status(201).json({message:"Album created successfully" , album})
    } catch (error) {
        console.error("Error creating album:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllAlbums = async(req:AuthRequest , res:Response) =>{
    try {
        const albums = await prisma.album.findMany({
            include: {
                songs: true,
                artists: true
            }
        })
        return res.status(200).json({message:"All albums fetched successfully" , albums})
    } catch (error) {
        console.error("Error fetching all albums:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getAlbumDetails = async(req:AuthRequest , res:Response) =>{
    try {
        const {id} = req.params
        if(!id){
            return res.status(400).json({message:"Album ID is required"})
        }
        const album = await prisma.album.findUnique({
            where:{
                id:String(id)
            },
            include: {
                songs: true,
                artists: true
            }
        })
        if(!album){
            return res.status(404).json({message:"Album not found"})
        }

        return res.status(200).json({message:"Album details fetched successfully" , album})
    } catch (error) {
        console.error("Error fetching album details:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteAlbum = async(req:AuthRequest , res:Response) =>{
    try {
        const {id} = req.params
        if(!id){
            return res.status(400).json({message:"Album ID is required"})
        }

        const findAlbum = await prisma.album.findUnique({
            where: {
                id: String(id)
            }
        });
        if (!findAlbum) {
            return res.status(404).json({ message: "Album not found" });
        }

        const album = await prisma.album.delete({
            where:{
                id:String(id)
            }
        })

        return res.status(200).json({message:"Album deleted successfully" , album})
    } catch (error) {
        console.error("Error deleting album:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const updateAlbum = async(req:AuthRequest , res:Response) =>{
    try {
        const {id} = req.params
        if(!id){
            return res.status(400).json({message:"Album ID is required"})
        }

        const {artistId , imageUrl , title , releaseYear } = req.body
        if(!artistId || !imageUrl || !title || !releaseYear ){
            return res.status(400).json({message:"All fields (including artistId) are required"})
        }

        const findAlbum = await prisma.album.findUnique({
            where:{
                id:String(id)
            }
        })
        if(!findAlbum){
            return res.status(404).json({message:"Album not found"})
        }

        const parsedReleaseYear = parseInt(releaseYear, 10);
        if (isNaN(parsedReleaseYear)) {
            return res.status(400).json({ message: "Release year must be a valid number" });
        }

        const artistExists = await prisma.artist.findUnique({ where: { id: String(artistId) } });
        if (!artistExists) {
            return res.status(404).json({ message: "Artist not found" });
        }

        const album = await prisma.album.update({
            where:{
                id:String(id)
            },
            data:{
                title,
                imageUrl,
                releaseYear: parsedReleaseYear,
                artists: {
                    // This links the new artist. If you want to replace entirely, use 'set'
                    connect: { id: String(artistId) }
                }
            }
        })

        return res.status(200).json({message:"Album updated successfully" , album})
    } catch (error) {
        console.error("Error updating album:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}