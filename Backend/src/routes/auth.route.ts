import { Router } from "express";
import { singup , login , getMe, logout } from "../controllers/auth.controller.js";
import { authUser } from "../middleware/auth.middleware.js";
import passport from "passport";

const authRouter = Router()
//signup and login
authRouter.post("/signup" , singup)
authRouter.post("/login" , login)
authRouter.post("/logout" , logout)

//get current user
authRouter.get("/me" , authUser , getMe)

// ---------------------------------
// Google OAuth Routes
// ---------------------------------
authRouter.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "http://localhost:5173/login?error=oauth_failed",
    }),
    (req, res) => {
        
        res.redirect("http://localhost:5173/");
    }
);

export default authRouter