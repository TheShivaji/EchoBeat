import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Applayout = () => {
    return (
        <div className="min-h-screen bg-[#0c0c0c] flex">

            {/* Fixed sidebar — 240px on md+ */}
            <Sidebar />

            {/* Main content — offset by sidebar width */}
            <main
                className="flex-1 md:ml-[240px] min-h-screen"
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