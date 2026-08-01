import { Router } from "express";
import { singup , login , getMe } from "../controllers/auth.controller.js";

const authRouter = Router()
//signup and login
authRouter.post("/signup" , singup)
authRouter.post("/login" , login)

//get current user
authRouter.get("/me" , getMe)

export default authRouter