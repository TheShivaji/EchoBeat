import config from "../config/config.js";
import multer from "multer";
import ImageKit from "imagekit";

export const imagekit = new ImageKit({
    publicKey: config.imagekitPublicKey,
    privateKey: config.imagekitPrivateKey,
    urlEndpoint: config.imagekitUrlEndpoint
});


export const upload = multer({
    storage:multer.memoryStorage(),
    limits:{fileSize : 50 * 1024 * 1024} //50MB
})