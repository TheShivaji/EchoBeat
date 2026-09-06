import { Router } from "express";
import { understandMusic } from "../controllers/ai.controller.js";

const router = Router();

router.post("/understand", understandMusic);

export default router;