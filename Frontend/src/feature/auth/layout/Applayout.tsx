import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../hook/authUse";
import { MiniPlayer } from "../../players/components/MiniPlayer";
import { PlayerProvider } from "../../players/context/PlayerProvider";

const Applayout = () => {
    const { handleLogout } = useAuth();
    const location = useLocation();

    // Hide MiniPlayer on the dedicated PlayerPage
    const isPlayerPage = location.pathname === "/player";

    return (
        <PlayerProvider>
            <div className="min-h-screen bg-[#0c0c0c] flex">

                {/* Fixed sidebar — 240px on md+ */}
                <Sidebar onLogout={handleLogout} />

                {/* Main content — offset by sidebar width */}
                <main
                    className="flex-1 md:ml-[240px] min-h-screen min-w-0 overflow-x-hidden relative"
                    id="main-content"
                >
                    <div className={!isPlayerPage ? "pb-24 md:pb-32" : ""}> 
                        <Outlet />
                    </div>
                </main>
                
                {/* Global Music Player (Mini UI) */}
                {!isPlayerPage && <MiniPlayer />}
            </div>
        </PlayerProvider>
    );
};

export default Applayout;