import {Router} from "express"
import {authUser} from "../middleware/auth.middleware"

const albumRouter = Router()
albumRouter.post("/create-album" , authUser , createAlbum) 
export default albumRouter