import { Router } from "express";
import { authUser, userAdmin } from "../middleware/auth.middleware.js";
import { upload } from "../utils/multer.js"

const adminRouter = Router()

adminRouter.post("/song", authUser, userAdmin, upload.fields([{ name: "audioFile", maxCount: 1 }, { name: "imageFile", maxCount: 1 }]))

export default adminRouter