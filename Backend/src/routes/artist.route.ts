import { Router } from "express";
import { createArtist, getArtistAlbam, getArtistDetails, getArtistSongs, getAllArtists, deleteArtist } from "../controllers/artist.controller.js";
import { authUser, userAdmin } from "../middleware/auth.middleware.js";
import { upload } from "../utils/multer.js";

const artistRouter = Router()

artistRouter.post("/create-artist" , authUser,upload.single('image') , createArtist)

artistRouter.get("/get-all-artists", getAllArtists)

artistRouter.get("/artist/:id", getArtistDetails)


artistRouter.get("/artist/:id/songs", getArtistSongs)
 
artistRouter.get("/artists/:id/album" , getArtistAlbam)

artistRouter.delete("/delete-artist/:id", authUser, userAdmin, deleteArtist)

export default artistRouter
