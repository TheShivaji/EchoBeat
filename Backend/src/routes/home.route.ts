import { Router } from "express";
import { getHomeData } from "../controllers/home.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authUser, getHomeData);

export default router;
