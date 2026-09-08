import { Router } from "express";
import { understandMusic, createAIPlaylist, getAILyrics } from "../controllers/ai.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/understand", authUser, understandMusic);
router.post("/playlist", authUser, createAIPlaylist);
router.post("/lyrics", authUser, getAILyrics);

export default router;

