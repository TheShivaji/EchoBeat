import { Router } from "express";
import { deleteSong, uploadSong, addSongToAlbum, getAllSongs, getSongDetails, unlikeSong, likeSong, getAllLikedSongs } from "../controllers/song.controller.js";
import { authUser } from "../middleware/auth.middleware.js";
import { userAdmin } from "../middleware/auth.middleware.js";
import { upload } from "../utils/multer.js";

const songRouter = Router();
songRouter.post("/upload", authUser, userAdmin, upload.fields([{ name: "audioFile", maxCount: 1 }, { name: "imageFile", maxCount: 1 }]), uploadSong)
songRouter.delete("/delete/:id", authUser, userAdmin, deleteSong)
songRouter.post("/album/:albumID/song", authUser, userAdmin, addSongToAlbum)

songRouter.get("/get-all-songs", authUser, getAllSongs)

songRouter.get("/get-song-details/:songID" , authUser , getSongDetails)

songRouter.post("/songs/:songId/like" , authUser , likeSong)

songRouter.delete("/songs/:songId/like" , authUser , unlikeSong)
songRouter.get("/liked-songs" , authUser , getAllLikedSongs)
export default songRouter;