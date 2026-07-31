import { Router } from "express";
import { deleteSong, uploadSong, addSongToAlbum, getAllSongs, getSongDetails } from "../controllers/song.controller.js";
import { authUser } from "../middleware/auth.middleware.js";
import { userAdmin } from "../middleware/auth.middleware.js";

const songRouter = Router();
songRouter.post("/upload", authUser, userAdmin , uploadSong)
songRouter.delete("/delete/:id", authUser, userAdmin, deleteSong)
songRouter.post("/album/:albumID/song", authUser, userAdmin, addSongToAlbum)

songRouter.get("/get-all-songs", authUser, getAllSongs)

songRouter.get("/get-song-details/:songID" , authUser , getSongDetails)

export default songRouter;