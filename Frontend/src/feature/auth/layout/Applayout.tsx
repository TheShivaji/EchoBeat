import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../hook/authUse";

const Applayout = () => {
    const { handleLogout } = useAuth();

    return (
        <div className="min-h-screen bg-[#0c0c0c] flex">

            {/* Fixed sidebar — 240px on md+ */}
            <Sidebar onLogout={handleLogout} />

            {/* Main content — offset by sidebar width */}
            <main
                className="flex-1 md:ml-[240px] min-h-screen min-w-0 overflow-x-hidden"
                id="main-content"
            >
                {/* Mobile bottom-nav safe area */}
                <div className="pb-16 md:pb-0">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Applayout;