import { Router } from "express";
import { authUser } from "../middleware/auth.middleware.js";
import { createPlaylist, updatePlaylist, getUserPlaylists, getPlaylistDetails, deletePlaylist } from "../controllers/playlist.controller.js";
import { upload } from "../utils/multer.js";

const playlistRouter = Router();

// Create playlist 
playlistRouter.post("/create", authUser, upload.fields([{ name: "imageFile", maxCount: 1 }]), createPlaylist);

// Update playlist
playlistRouter.put("/update/:id", authUser, upload.fields([{ name: "imageFile", maxCount: 1 }]), updatePlaylist);

// Get all playlists belonging to current user
playlistRouter.get("/my-playlists", authUser, getUserPlaylists);

// Get single playlist details
playlistRouter.get("/:id", authUser, getPlaylistDetails);

// Delete playlist
playlistRouter.delete("/delete/:id", authUser, deletePlaylist);

export default playlistRouter;
