import { Disc3 } from "lucide-react";

const Home = () => {
    return (
        <div className="min-h-screen bg-[#0c0c0c] px-8 md:px-12 py-10">

            {/* Page header */}
            <header className="mb-12">
                <p className="text-[11px] font-semibold text-[#555555] tracking-[0.14em] uppercase mb-2">
                    Good evening
                </p>
                <h1
                    className="text-[36px] font-normal text-[#ededed] leading-tight tracking-[-0.02em]"
                    style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
                >
                    Home
                </h1>
            </header>

            {/* Empty state */}
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-14 h-14 rounded-full bg-[#181818] border border-[#252525] flex items-center justify-center mb-6">
                    <Disc3
                        size={22}
                        strokeWidth={1.25}
                        className="text-[#555555]"
                        aria-hidden="true"
                    />
                </div>
                <h2
                    className="text-[22px] font-normal text-[#c0c0c0] mb-3 tracking-[-0.01em]"
                    style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
                >
                    Your music, all in one place
                </h2>
                <p className="text-[14px] text-[#666666] font-normal max-w-[320px] leading-relaxed">
                    Browse your library, discover new songs, and pick up where you left off.
                </p>
            </div>
        </div>
    );
};

export default Home;