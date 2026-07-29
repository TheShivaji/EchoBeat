import dotenv from "dotenv";

dotenv.config()

export default {
    port: process.env.PORT || 5000,
    databaseUrl: process.env.DATABASE_URL!,
    jwtSecret: process.env.JWT_SECRET!,
    jwtCookieExpire: process.env.JWT_COOKIE_EXPIRE || 24*60*60*1000,
}
