import { Router } from "express";
import { playSong, getRecentlyPlayed, getPopularArtist, getPopularSongs, deleteHistory } from "../controllers/history.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/play", authUser, playSong);
router.get("/recent", authUser, getRecentlyPlayed);
router.get("/popular-artists", getPopularArtist);
router.get("/popular-songs", getPopularSongs);
router.delete("/recent", authUser, deleteHistory);

export default router;
