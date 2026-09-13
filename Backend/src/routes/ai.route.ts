import { Router } from "express";
import { understandMusic, createAIPlaylist, getAILyrics, chatbotAssistant } from "../controllers/ai.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/understand", authUser, understandMusic);
router.post("/playlist", authUser, createAIPlaylist);
router.post("/lyrics", authUser, getAILyrics);
router.post("/assistant", authUser, chatbotAssistant);

export default router;

