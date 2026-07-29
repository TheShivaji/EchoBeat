import { Router } from "express";
import { singup , login , getMe } from "../controllers/auth.controller.js";

const authRouter = Router()

authRouter.post("/signup" , singup)
authRouter.post("/login" , login)
authRouter.get("/me" , getMe)

export default authRouter