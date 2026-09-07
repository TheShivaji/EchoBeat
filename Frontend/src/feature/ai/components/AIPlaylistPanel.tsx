import React from "react";
import { Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { useAIPlaylist } from "../hook/useAIPlaylist";

export const AIPlaylistPanel: React.FC = () => {
    const {
        prompt,
        setPrompt,
        loading,
        error,
        successInfo,
        maxLength,
        handleGenerate,
    } = useAIPlaylist();

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && !loading && !successInfo) {
            handleGenerate();
        }
    };

    const isNearLimit = prompt.length > maxLength * 0.8;
    const isOverLimit = prompt.length > maxLength;
    const isDisabled = loading || !!successInfo || isOverLimit;

    return (
        <div className="w-full mt-2">
            {/* Section label */}
            <div className="flex items-center gap-2 mb-7">
                <Sparkles className="w-3 h-3 text-[#4a4a4a]" strokeWidth={1.5} />
                <span
                    className="text-[10px] font-semibold text-[#4a4a4a] tracking-[0.2em] uppercase"
                    style={{ letterSpacing: "0.18em" }}
                >
                    AI Playlist Generator
                </span>
            </div>

            {/* Heading */}
            <h2
                className="text-[26px] md:text-[34px] font-normal text-[#c8c8c8] leading-tight tracking-[-0.01em] mb-3"
                style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
            >
                Create a playlist from a thought.
            </h2>
            <p className="text-[13px] text-[#444444] mb-8 leading-relaxed max-w-xl">
                Describe what you want to hear — artist, mood, language, occasion. EchoBeats will find the right songs and build it for you.
            </p>

            <div className="w-full max-w-2xl">
                {/* Textarea */}
                <div className="relative mb-1">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value.slice(0, maxLength + 10))}
                        onKeyDown={handleKeyDown}
                        placeholder="Arijit Singh ke 10 romantic songs ki playlist bana do..."
                        disabled={loading || !!successInfo}
                        rows={4}
                        className={[
                            "w-full resize-none",
                            "bg-[#0e0e0e] text-[#d8d8d8] text-[14px] leading-relaxed",
                            "rounded-2xl border px-5 py-4 pb-8",
                            "placeholder:text-[#2e2e2e] placeholder:font-normal",
                            "focus:outline-none",
                            "transition-colors duration-200",
                            "disabled:opacity-40 disabled:cursor-not-allowed",
                            error
                                ? "border-[#4a1a1a] focus:border-[#6a2a2a]"
                                : "border-[#1a1a1a] hover:border-[#242424] focus:border-[#2e2e2e]",
                        ].join(" ")}
                    />
                    {/* Character count overlay */}
                    <span
                        className={[
                            "absolute bottom-3 right-4 text-[10px] tabular-nums pointer-events-none",
                            "transition-colors duration-200",
                            isOverLimit
                                ? "text-[#c04040]"
                                : isNearLimit
                                ? "text-[#555555]"
                                : "text-[#252525]",
                        ].join(" ")}
                    >
                        {prompt.length}/{maxLength}
                    </span>
                </div>

                {/* Error */}
                {error && (
                    <p className="text-[12px] text-[#b85555] mb-4 mt-3 leading-snug pl-1">
                        {error}
                    </p>
                )}

                {/* Success flash */}
                {successInfo && (
                    <div className="flex items-center gap-2.5 mb-4 mt-3 text-[13px] text-[#c8c8c8]">
                        <CheckCircle2 className="w-4 h-4 text-[#4a8e6a] shrink-0" strokeWidth={2} />
                        <span>
                            Playlist created —{" "}
                            <span className="font-medium">"{successInfo.name}"</span>
                            {" · "}
                            <span className="text-[#666666]">
                                {successInfo.count} {successInfo.count === 1 ? "song" : "songs"}
                            </span>
                        </span>
                    </div>
                )}

                {/* Action row */}
                <div className="flex items-center gap-4 mt-4">
                    <button
                        id="ai-playlist-generate-btn"
                        onClick={handleGenerate}
                        disabled={isDisabled}
                        className={[
                            "flex items-center gap-2",
                            "h-11 px-6 rounded-full",
                            "text-[13px] font-medium",
                            "transition-all duration-200 ease-out",
                            "select-none",
                            isDisabled
                                ? "bg-[#141414] text-[#3a3a3a] border border-[#1e1e1e] cursor-not-allowed"
                                : "bg-[#e8e8e8] text-[#0a0a0a] hover:bg-white active:scale-[0.97] border border-transparent cursor-pointer",
                        ].join(" ")}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Creating playlist…</span>
                            </>
                        ) : successInfo ? (
                            <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Redirecting…</span>
                            </>
                        ) : (
                            <span>Create Playlist</span>
                        )}
                    </button>

                    {!loading && !successInfo && (
                        <span className="text-[11px] text-[#282828] hidden sm:block">
                            ⌘ Enter to generate
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
