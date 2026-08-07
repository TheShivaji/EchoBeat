import { Router } from "express";
import { playSong, getRecentlyPlayed } from "../controllers/history.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/play", authUser, playSong);
router.get("/recent", authUser, getRecentlyPlayed);

export default router;
