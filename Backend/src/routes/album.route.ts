import { Router } from "express";
import { authUser, userAdmin } from "../middleware/auth.middleware.js";
import { createAlbum, getAllAlbums, getAlbumDetails, deleteAlbum, updateAlbum } from "../controllers/album.controller.js";
import { upload } from "../utils/multer.js";

const albumRouter = Router();

// Create album
albumRouter.post("/create-album", authUser, userAdmin, upload.single("imageFile"), createAlbum);

// Get all albums
albumRouter.get("/get-all-albums", authUser, getAllAlbums);

// Get album details by ID
albumRouter.get("/get-album-details/:id", authUser, getAlbumDetails);

// Delete album
albumRouter.delete("/delete-album/:id", authUser, deleteAlbum);

// Update album details
albumRouter.put("/update-album/:id", authUser, updateAlbum);

export default albumRouter;
