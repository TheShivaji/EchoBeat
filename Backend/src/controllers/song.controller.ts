import ImageKit from "imagekit"
import { response, type Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { prisma } from "../config/db.js";
import { imagekit } from "../utils/multer.js";
import { AnyNull } from "@prisma/client/runtime/client";
import { extractEmbeddedCover } from "../utils/audioMetadata.js";


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
        const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
        };

        const audioFile = files["audioFile"]?.[0];
        const imageFile = files["imageFile"]?.[0];

        // Audio is required
        if (!audioFile) {
            return res.status(400).json({
                success: false,
                message: "Please upload an audio file",
            });
        }

        const {
            title,
            artistId,
            duration,
            category,
            albumID,
        } = req.body;

        // Basic validation
        if (!title || !artistId || !duration) {
            return res.status(400).json({
                success: false,
                message:
                    "Please fill all the details (title, artistId, duration)",
            });
        }

        const DEFAULT_IMAGE_URL =
            "your-imagekit-default-cover-url";

        // Check artist
        const artistExists = await prisma.artist.findFirst({
            where: {
                id: String(artistId),
                isDeleted: false,
            },
        });

        if (!artistExists) {
            return res.status(404).json({
                success: false,
                message: "Artist not found",
            });
        }

        // Check album if provided
        if (albumID) {
            const albumExists = await prisma.album.findFirst({
                where: {
                    id: String(albumID),
                },
            });

            if (!albumExists) {
                return res.status(404).json({
                    success: false,
                    message: "Album not found",
                });
            }
        }

        // Extract embedded cover from audio
        const embeddedCover = await extractEmbeddedCover(
            audioFile.buffer,
            audioFile.mimetype
        );

        // Audio upload
        const audioUploadPromise = imagekit.upload({
            file: audioFile.buffer,
            fileName: audioFile.originalname,
            folder: "Songs",
        });

        // Cover upload
        let imageUploadPromise;

        if (imageFile) {
            // Priority 1: User uploaded cover
            imageUploadPromise = imagekit.upload({
                file: imageFile.buffer,
                fileName: imageFile.originalname,
                folder: "Songs/Images",
            });
        } else if (embeddedCover) {
            // Priority 2: Embedded cover from audio
            imageUploadPromise = imagekit.upload({
                file: embeddedCover.buffer,
                fileName:
                    audioFile.originalname.split(".")[0] +
                    "-cover",
                folder: "Songs/Images",
            });
        } else {
            // Priority 3: Default cover
            imageUploadPromise = Promise.resolve(null);
        }

        // Upload audio and cover in parallel
        const [
            audioUploadResponse,
            imageUploadResponse,
        ] = await Promise.all([
            audioUploadPromise,
            imageUploadPromise,
        ]);

        // Final image URL
        const imageUrl =
            imageUploadResponse?.url ?? DEFAULT_IMAGE_URL;

        // Create song
        const song = await prisma.song.create({
            data: {
                title: String(title),

                artists: {
                    connect: {
                        id: String(artistId),
                    },
                },

                audioUrl: audioUploadResponse.url,
                imageUrl,

                duration: parseInt(String(duration), 10),

                category: category
                    ? String(category)
                    : null,

                releasedDate: new Date().toISOString(),

                ...(albumID
                    ? {
                        album: {
                            connect: {
                                id: String(albumID),
                            },
                        },
                    }
                    : {}),
            },
        });

        return res.status(201).json({
            success: true,
            message: "Song uploaded successfully",
            song,
        });
    } catch (error) {
        console.error("Upload Song Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

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
            return res.status(400).json({
                success: false,
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
            return res.status(404).json({
                success: false,
                message: "Song not found"
            })
        }

        const songLikeDetails = await prisma.likedSong.findUnique({
            where: {
                userId_songId: {
                    userId: req.user.id,
                    songId: songID
                }
            }
        })
        const isLiked = songLikeDetails !== null;

        const likeCount = await prisma.likedSong.count({
            where: {
                songId: songID
            }
        })

        return res.status(200).json({
            success: true,
            message: "Song details fetched successfully",
            song,
            isLiked,
            likeCount
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const likeSong = async (req: AuthRequest, res: Response) => {
    try {
        const { songId } = req.params
        if (!songId || typeof songId !== "string") {
            return res.status(400).json({ message: "Song ID is invalid" })
        }
        const song = await prisma.song.findUnique({
            where: {
                id: songId
            }
        })
        if (!song) {
            return res.status(404).json({ message: "Song not found" })
        }

        const alreadyLikedSong = await prisma.likedSong.findUnique({
            where: {
                userId_songId: {
                    userId: req.user.id,
                    songId: songId
                }
            }
        })
        if (alreadyLikedSong) {
            return res.status(400).json({ message: "Song already liked" })
        }
        const likedSong = await prisma.likedSong.create({
            data: {
                userId: req.user.id,
                songId: songId
            }
        })
        return res.status(200).json({ message: "Song liked successfully", likedSong })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const unlikeSong = async (req: AuthRequest, res: Response) => {
    try {
        const { songId } = req.params
        if (!songId || typeof songId !== "string") {
            return res.status(400).json({ message: "Song ID is invalid" })
        }
        const song = await prisma.song.findUnique({
            where: {
                id: songId
            }
        })
        if (!song) {
            return res.status(404).json({ message: "Song not found" })
        }

        const likedSong = await prisma.likedSong.findUnique({
            where: {
                userId_songId: {
                    userId: req.user.id,
                    songId: songId
                }
            }
        })
        if (!likedSong) {
            return res.status(400).json({ message: "Song not liked" })
        }
        const unlikedSong = await prisma.likedSong.delete({
            where: {
                id: likedSong.id
            }
        })
        return res.status(200).json({ message: "Song unliked successfully", unlikedSong })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const getAllLikedSongs = async (req: AuthRequest, res: Response) => {
    try {
        const likedSongs = await prisma.likedSong.findMany({
            where: {
                userId: req.user.id
            },
            include: {
                song: true
            }
        })
        if (!likedSongs.length) {
            return res.status(404).json({ message: "No liked songs found" })
        }
        return res.status(200).json({ message: "Liked songs fetched successfully", likedSongs })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}