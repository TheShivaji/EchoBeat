import { Router } from "express"
import { searchArtists, searchSong, searchAlbum, searchPlaylist } from "../controllers/search.controller.js"
import { authUser } from "../middleware/auth.middleware.js"

const searchRouter = Router()

searchRouter.use(authUser)
searchRouter.get("/artists", searchArtists)
searchRouter.get("/songs", searchSong)
searchRouter.get("/albums", searchAlbum)
searchRouter.get("/playlists", searchPlaylist)

export default searchRouter