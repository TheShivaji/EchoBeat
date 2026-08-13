import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import songRouter from "./routes/songs.route.js";
import albumRouter from "./routes/album.route.js";
import playlistRouter from "./routes/playlist.route.js";
import artistRouter from "./routes/artist.route.js";
import searchRouter from "./routes/search.routes.js";
import historyRouter from "./routes/history.route.js";
import homeRouter from "./routes/home.route.js";


dotenv.config();

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());



app.use('/api/user', authRouter);
app.use('/api/songs', songRouter);
app.use('/api/album', albumRouter);
app.use('/api/playlist', playlistRouter);
app.use('/api/artist', artistRouter);
app.use('/api/search', searchRouter)
app.use('/api/history', historyRouter);
app.use('/api/home', homeRouter);

export default app;