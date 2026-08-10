import { Router } from "express";
import { playSong, deleteHistory } from "../controllers/history.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/play", authUser, playSong);
router.delete("/recent", authUser, deleteHistory);

export default router;
