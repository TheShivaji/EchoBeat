import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import songRouter from "./routes/songs.route.js";
import albumRouter from "./routes/album.route.js";
import playlistRouter from "./routes/playlist.route.js";
import artistRouter from "./routes/artist.route.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/user', authRouter);
app.use('/api/song', songRouter);
app.use('/api/album', albumRouter);
app.use('/api/playlist', playlistRouter);
app.use('/api/artist', artistRouter);

export default app;