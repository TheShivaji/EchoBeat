import type { Request, Response, NextFunction } from "express";
import express from "express";
import AppError from "./utils/AppError.js";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import passport from "./config/passport.js";
import cookieParser from "cookie-parser";
import { pinoHttp } from "pino-http";
import helmet from "helmet";
import compression from "compression";
import { rateLimit } from "express-rate-limit";
import redisStore from "rate-limit-redis";
import { redis } from "./config/redis.js";
import authRouter from "./routes/auth.route.js";
import songRouter from "./routes/songs.route.js";
import albumRouter from "./routes/album.route.js";
import playlistRouter from "./routes/playlist.route.js";
import artistRouter from "./routes/artist.route.js";
import searchRouter from "./routes/search.routes.js";
import historyRouter from "./routes/history.route.js";
import homeRouter from "./routes/home.route.js";
import aiRouter from "./routes/ai.route.js";
import logger from "./utils/logger.js";

dotenv.config();

const app = express();
app.set("trust proxy", 1);


app.use(helmet());

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, //15 minutes
    store: new redisStore({
        sendCommand: (...args: string[]) => redis.sendCommand(args),
        prefix: "rl-global:",
    }),
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests, please try again later." },
});

const aiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, //15 minutes
    store: new redisStore({
        sendCommand: (...args: string[]) => redis.sendCommand(args),
        prefix: "rl-ai:",
    }),
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many AI requests, please try again later." },
});
app.use(pinoHttp({ logger }));
app.use("/api", globalLimiter);


app.use(compression());


app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));


app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());





app.use(
    session({
        secret: process.env.SESSION_SECRET || "fallback_dev_secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        },
    })
);


app.use(passport.initialize());
app.use(passport.session());


app.get("/api/health", (_req: Request, res: Response) => {
    res.status(200).json({ success: true, message: "Server is healthy", uptime: process.uptime() });
});


app.use("/api/user", authRouter);
app.use("/api/songs", songRouter);
app.use("/api/album", albumRouter);
app.use("/api/playlist", playlistRouter);
app.use("/api/artists", artistRouter);
app.use("/api/search", searchRouter);
app.use("/api/history", historyRouter);
app.use("/api/home", homeRouter);
app.use("/api/ai", aiLimiter, aiRouter);


app.use((_req: Request, res: Response) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err: AppError | Error, _req: Request, res: Response, _next: NextFunction) => {
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const isOperational = err instanceof AppError ? err.isOperational : false;

    if (isOperational) {
        logger.warn({ statusCode, message: err.message }, "Operational error");
    } else {
        logger.error(err, "Unexpected error");
    }

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
    });
});

export default app;
