import { Link } from "react-router-dom";
import { Disc3, ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
    return (
        <main className="min-h-screen bg-[#0c0c0c] flex flex-col items-center justify-center px-5 py-16">

            {/* Brand */}
            <div className="flex items-center gap-2.5 mb-16">
                <Disc3 size={17} strokeWidth={1.5} className="text-[#c8c8c8]" aria-hidden="true" />
                <span className="text-[#c8c8c8] text-[13px] font-semibold tracking-[0.1em] uppercase">
                    EchoBeats
                </span>
            </div>

            {/* Error label */}
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#555555] mb-5">
                Error 404
            </p>

            {/* Heading */}
            <h1
                className="text-[38px] font-normal text-[#dddddd] leading-[1.2] tracking-[-0.02em] text-center"
                style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
            >
                Page not found
            </h1>
            <p className="mt-4 text-[14px] text-[#888888] font-normal text-center max-w-[300px] leading-relaxed">
                This page doesn't exist or may have been moved.
            </p>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-12">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-md border border-[#252525] text-[#888888] text-[13px] font-medium hover:border-[#333333] hover:text-[#d0d0d0] transition-all duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#444444]"
                >
                    <ArrowLeft size={14} strokeWidth={1.75} />
                    Go back
                </button>
                <Link
                    to="/"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#f0f0f0] text-[#0c0c0c] text-[13px] font-medium hover:bg-white transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f0f0f0]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c0c0c]"
                >
                    <Home size={14} strokeWidth={1.75} />
                    Home
                </Link>
            </div>
        </main>
    );
};

export default NotFound;
