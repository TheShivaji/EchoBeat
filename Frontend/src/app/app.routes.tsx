import { createBrowserRouter } from "react-router-dom";
import Home from "../feature/home/pages/Home";
import Login from "../feature/auth/pages/Login";
import Signup from "../feature/auth/pages/Singup";
import { Protected } from "../feature/auth/components/Protected";
import Applayout from "../feature/auth/layout/Applayout";
import PublicRoute from "../feature/auth/components/PublicRoute";
import NotFound from "../feature/auth/pages/NotFound";
import Upload from "../feature/upload/page/UploadPage"
import CreateArtist from "../feature/artists/pages/CreateArtistPage";
import SongDetailsPage from "../feature/song/pages/SongDetailsPage";
import ArtistDetailsPage from "../feature/artists/pages/ArtistDetailsPage";
import AllArtistsPage from "../feature/artists/pages/AllArtistsPage";
import ArtistSongsPage from "../feature/artists/pages/ArtistSongsPage";
import ArtistAlbumsPage from "../feature/artists/pages/ArtistAlbumsPage";
import AllAlbumsPage from "../feature/album/pages/AllAlbumsPage";
import NewReleasesPage from "../feature/song/pages/NewReleasesPage";
import CreateAlbumPage from "../feature/album/pages/CreateAlbumPage";
import CreatePlaylistPage from "../feature/playlist/pages/CreatePlaylistPage";
import MyPlaylistsPage from "../feature/playlist/pages/MyPlaylistsPage";
import PlaylistDetailsPage from "../feature/playlist/pages/PlaylistDetailsPage";
import LikedSongsPage from "../feature/song/pages/LikedSongsPage";
import AlbumDetailsPage from "../feature/album/pages/AlbumDetailsPage";

const appRouter = createBrowserRouter([
    {
        element: <PublicRoute />,
        children: [
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/register",
                element: <Signup />,
            },
        ],
    },

    {
        element: <Protected />,
        children: [
            {
                element: <Applayout />,
                children: [
                    {
                        path: "/",
                        element: <Home />,
                    },
                    {
                        path: "/create-playlist",
                        element: <CreatePlaylistPage />,
                    },
                    {
                        path: "/song/:id",
                        element: <SongDetailsPage />
                    },
                    {
                        path: "/artist/:id",
                        element: <ArtistDetailsPage />
                    },
                    {
                        path: "/artist/:id/songs",
                        element: <ArtistSongsPage />
                    },
                    {
                        path: "/artist/:id/albums",
                        element: <ArtistAlbumsPage />
                    },
                    {
                        path: "/artists",
                        element: <AllArtistsPage />
                    },
                    {
                        path: "/albums",
                        element: <AllAlbumsPage />
                    },
                    {
                        path: "/new-releases",
                        element: <NewReleasesPage />
                    },
                    {
                        path: "/playlists",
                        element: <MyPlaylistsPage />
                    },
                    {
                        path: "/playlist/:id",
                        element: <PlaylistDetailsPage />
                    },
                    {
                        path: "/liked",
                        element: <LikedSongsPage />
                    },
                    {
                        path: "/album/:id",
                        element: <AlbumDetailsPage />
                    },
                    {
                        element: <Protected requiredRole="ADMIN" />,
                        children: [
                            {
                                path: "/upload",
                                element: <Upload />,
                            },
                            {
                                path: "/create-artist",
                                element: <CreateArtist />,
                            },
                            {
                                path: "/create-album",
                                element: <CreateAlbumPage />,
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        path: "*",
        element: <NotFound />,
    },
]);

export default appRouter;