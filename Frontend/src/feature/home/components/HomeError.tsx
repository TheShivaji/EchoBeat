import { RefreshCw } from "lucide-react";

interface HomeErrorProps {
    onRetry: () => void;
}

const HomeError = ({ onRetry }: HomeErrorProps) => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
        <p className="text-[11px] font-semibold text-[#555555] tracking-[0.14em] uppercase mb-4">
            Something went wrong
        </p>
        <h2
            className="text-[24px] font-normal text-[#c0c0c0] mb-3 tracking-[-0.01em]"
            style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
        >
            Couldn't load your music
        </h2>
        <p className="text-[14px] text-[#666666] font-normal max-w-[280px] leading-relaxed mb-8">
            We had trouble connecting to the server. Check your connection and try again.
        </p>
        <button
            type="button"
            onClick={onRetry}
            className="flex items-center gap-2 px-6 py-2.5 rounded-md border border-[#252525] text-[#999999] text-[13px] font-medium hover:border-[#333333] hover:text-[#d0d0d0] transition-all duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#444444]"
        >
            <RefreshCw size={14} strokeWidth={1.75} />
            Try again
        </button>
    </div>
);

export default HomeError;
