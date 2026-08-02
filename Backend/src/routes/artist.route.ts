import { Router } from "express";
import {  createArtist } from "../controllers/artist.controller.js";
import { authUser } from "../middleware/auth.middleware.js";
import { upload } from "../utils/multer.js";

const artistRouter = Router()

artistRouter.post("/create-artist" , authUser,upload.single('image') , createArtist)

export default artistRouter

