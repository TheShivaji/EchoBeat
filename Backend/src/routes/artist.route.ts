import { Router } from "express";
import { createArtist, getArtistAlbam, getArtistDetails, getArtistSongs } from "../controllers/artist.controller.js";
import { authUser } from "../middleware/auth.middleware.js";
import { upload } from "../utils/multer.js";

const artistRouter = Router()

artistRouter.post("/create-artist" , authUser,upload.single('image') , createArtist)

artistRouter.get("/artist/:id", getArtistDetails)


artistRouter.get("/artist/:id/songs", getArtistSongs)
 
artistRouter.get("/artists/:id/album" , getArtistAlbam)

export default artistRouter
