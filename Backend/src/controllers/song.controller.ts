import ImageKit from "imagekit"
import { response, type Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { prisma } from "../config/db.js";
import { imagekit } from "../utils/multer.js";
import { AnyNull } from "@prisma/client/runtime/client";


async function addToAlbum(albumID: string, songID: string, action: string, res: Response) {
    if (!albumID || !songID || !action) {
        return res.status(400).json({ message: "All fields are required" })
    }

    const findAlbum = await prisma.album.findUnique({
        where: {
            id: albumID
        }
    })
    const findSong = await prisma.song.findUnique({
        where: {
            id: songID
        }
    })
    if (!findAlbum) {
        return res.status(404).json({ message: "Album not found" })
    }
    if (!findSong) {
        return res.status(404).json({ message: "Song not found" })
    }



    if (action !== "add" && action !== "remove") {
        return res.status(400).json({ message: "Invalid action" })
    }

    const actionOnSong = await prisma.album.update({
        where: {
            id: albumID
        },
        data: {
            songs: action === "add"
                ? { connect: { id: songID } }
                : { disconnect: { id: songID } }
        }
    });


    return res.status(200).json({
        message: `Song ${action === "add" ? "added to" : "removed from"} album successfully`,
        album: actionOnSong
    })
}

export const uploadSong = async (req: AuthRequest, res: Response) => {
    try {

        const files = req.files as { [fieldname: string]: Express.Multer.File[] }

        const audioFile = files['audioFile']?.[0]
        const imageFile = files['imageFile']?.[0]

        if (!audioFile || !imageFile) {
            return res.status(400).json({ message: "Please upload both audio and image files" })
        }

        const audioUploadPromise = imagekit.upload({
            file: audioFile.buffer,
            fileName: audioFile.originalname,
            folder: "Songs"
        })

        const imageUploadPromise = imagekit.upload({
            file: imageFile.buffer,
            fileName: imageFile.originalname,
            folder: "Songs/Images",

        })

        const [audioUploadResponse, imageUploadResponse] = await Promise.all([audioUploadPromise, imageUploadPromise])

        const { title, artistId, duration, category, albumID } = req.body

        if (!title || !artistId || !duration) {
            return res.status(400).json({ message: "Please fill all the details (title, artistId, duration)" })
        }

        const artistExists = await prisma.artist.findUnique({ where: { id: String(artistId) } });
        if (!artistExists) {
            return res.status(404).json({ message: "Artist not found" });
        }

        const song = await prisma.song.create({
            data: {
                title: title,
                artists: {
                    connect: { id: String(artistId) }
                },
                audioUrl: audioUploadResponse.url,
                imageUrl: imageUploadResponse.url,
                duration: parseInt(duration, 10),
                category: category,
                albumID: albumID || null
            }
        })
        if (albumID) {
            await prisma.album.update({
                where: {
                    id: albumID
                },
                data: {
                    songs: {
                        connect: {
                            id: song.id
                        }
                    }
                }
            })
        }

        return res.status(200).json({
            message: "Song uploaded successfully",
            song
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const deleteSong = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params
        if (!id || typeof id !== 'string') {
            return res.status(400).json({ message: "Song ID is invalid" })
        }
        const song = await prisma.song.delete({
            where: {
                id: id
            }
        })

        if (song.albumID) {
            await prisma.album.update({
                where: {
                    id: song.albumID
                },
                data: {
                    songs: {
                        delete: {
                            id: song.id
                        }
                    }
                }
            })
        }
        return res.status(200).json({
            message: "Song deleted successfully",
            song
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const addSongToAlbum = async (req: AuthRequest, res: Response) => {
    try {
        const { albumID } = req.params
        const { songID, action } = req.body
        if (typeof albumID !== "string") {
            return res.status(400).json({ message: "Invalid album ID" })
        }

        //Function call fo add song to album
        await addToAlbum(albumID, songID, action, res)

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const getAllSongs = async (req: AuthRequest, res: Response) => {
    try {
        const songs = await prisma.song.findMany()
        return res.status(200).json(songs)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}
export const getSongDetails = async (req: AuthRequest, res: Response) => {
    try {
        const { songID } = req.params  // Bug 1 Fix: destructure kiya

        if (!songID || typeof songID !== "string") {
            return res.status(400).json({   // Bug 2 Fix: response → res
                message: "Song ID is required"
            })
        }

        const song = await prisma.song.findUnique({
            where: {
                id: songID  // Bug 1 Fix: ab string hai, object nahi
            },
            include: {
                artists: true,
                album: true
            }
        })

        if (!song) {
            return res.status(404).json({   // Bug 3 Fix: response → res
                message: "Song not found"
            })
        }

        return res.status(200).json({
            message: "Song details fetched successfully",
            song
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const likeSong = async (req:AuthRequest , res:Response)=>{
    try{
        const {songId} = req.params
        if(!songId || typeof songId !== "string"){
            return res.status(400).json({message:"Song ID is invalid"})
        }
        const song = await prisma.song.findUnique({
            where:{
                id:songId
            }
        })
        if(!song){
            return res.status(404).json({message:"Song not found"})
        }

        const alreadyLikedSong = await prisma.likedSong.findUnique({
            where:{
                userId_songId:{
                    userId:req.user.id,
                    songId:songId
                }
            }
        })
        if(alreadyLikedSong){
            return res.status(400).json({message:"Song already liked"})
        }
        const likedSong = await prisma.likedSong.create({
            data:{
                userId:req.user.id,
                songId:songId
            }
        })
        return res.status(200).json({message:"Song liked successfully",likedSong})
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal server error"})
    }
}

export const unlikeSong = async (req:AuthRequest , res:Response)=>{
    try{
        const {songId} = req.params
        if(!songId || typeof songId !== "string"){
            return res.status(400).json({message:"Song ID is invalid"})
        }
        const song = await prisma.song.findUnique({
            where:{
                id:songId
            }
        })
        if(!song){
            return res.status(404).json({message:"Song not found"})
        }

        const likedSong = await prisma.likedSong.findUnique({
            where:{
                userId_songId:{
                    userId:req.user.id,
                    songId:songId
                }
            }
        })
        if(!likedSong){
            return res.status(400).json({message:"Song not liked"})
        }
        const unlikedSong = await prisma.likedSong.delete({
            where:{
                id:likedSong.id
            }
        })
        return res.status(200).json({message:"Song unliked successfully",unlikedSong})
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal server error"})
    }
}

export const getAllLikedSongs = async (req:AuthRequest , res:Response)=>{
    try{
        const likedSongs = await prisma.likedSong.findMany({
            where:{
                userId:req.user.id
            },
            include:{
                song:true
            }
        })
        if(!likedSongs.length){
            return res.status(404).json({message:"No liked songs found"})
        }
        return res.status(200).json({message:"Liked songs fetched successfully",likedSongs})
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal server error"})
    }
}