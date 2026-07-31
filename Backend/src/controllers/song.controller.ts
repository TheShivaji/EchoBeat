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

        const { title, artist, duration, category, albumID } = req.body

        if (!title || !artist || !duration) {
            return res.status(400).json({ message: "Please fill all the details (title, artist, duration)" })
        }

        const song = await prisma.song.create({
            data: {
                title: title,
                artist: artist,
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
export const  getSongDetails = async (req:AuthRequest , res:Response) =>
{
const songID = req.params

if(!songID || typeof songID !== "string"){
    return response.status(400).json({
        message:"all filed is required"
    })
}
const song = await prisma.song.findUnique({
    where:{
        id:songID
    }
})
if(!song){
    return response.status(404).json({
        message:"song not found"
    })
}
return res.status(200).json({
    message:"song details fetched successfully",
    song
})
}