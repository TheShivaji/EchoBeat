import dotenv from "dotenv";

dotenv.config()

if(!process.env.DATABASE_URL){
    throw new Error("Database URL is not defined")
}
if(!process.env.JWT_SECRET){
    throw new Error("JWT secret is not defined")
}

if(!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL_ENDPOINT){
    throw new Error("Imagekit credentials are not defined")
}

export default {
    port: process.env.PORT || 5000,
    databaseUrl: process.env.DATABASE_URL!,
    jwtSecret: process.env.JWT_SECRET!,
    jwtCookieExpire: process.env.JWT_COOKIE_EXPIRE || 24*60*60*1000,
    imagekitPublicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
    imagekitPrivateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    imagekitUrlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
}
