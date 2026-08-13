import { Router } from "express";
import { singup , login , getMe, logout } from "../controllers/auth.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const authRouter = Router()
//signup and login
authRouter.post("/signup" , singup)
authRouter.post("/login" , login)
authRouter.post("/logout" , logout)

//get current user
authRouter.get("/me" , authUser , getMe)

export default authRouter