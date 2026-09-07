import React from "react";
import { Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import { useAIPlaylist } from "../hook/useAIPlaylist";

/**
 * AIPlaylistGenerator
 *
 * Renders an AI-powered playlist creation form that feels native to the
 * EchoBeats playlist section. Designed to sit above the user's existing
 * playlists in MyPlaylistsPage, between the page header and the grid.
 */
export const AIPlaylistGenerator: React.FC = () => {
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

    const isOverLimit = prompt.length > maxLength;
    const isNearLimit = prompt.length > maxLength * 0.8;
    const isDisabled = loading || !!successInfo || isOverLimit;

    return (
        <div className="bg-[#121212] border border-[#222222] rounded-2xl p-6 md:p-8 mb-10 shadow-2xl">
            {/* Header row */}
            <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center shrink-0">
                        <Sparkles size={16} className="text-[#888888]" strokeWidth={1.5} />
                    </div>
                    <div>
                        <h2 className="text-[15px] font-semibold text-[#ededed] leading-tight">
                            Create with AI
                        </h2>
                        <p className="text-xs text-[#666666] mt-0.5 leading-snug">
                            Tell EchoBeats what you want to listen to.
                        </p>
                    </div>
                </div>
            </div>

            {/* Textarea */}
            <div className="relative mb-4">
                <textarea
                    id="ai-playlist-prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value.slice(0, maxLength + 10))}
                    onKeyDown={handleKeyDown}
                    placeholder="Arijit ke 10 romantic songs ki playlist bana do..."
                    disabled={loading || !!successInfo}
                    rows={3}
                    className={[
                        "w-full resize-none",
                        "bg-[#1a1a1a] text-[#ededed] text-[14px] leading-relaxed",
                        "rounded-xl border px-4 py-3 pb-7",
                        "placeholder:text-[#333333] placeholder:font-normal",
                        "focus:outline-none focus:ring-1",
                        "transition-all duration-200",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        error
                            ? "border-[#4a1a1a] focus:border-[#663333] focus:ring-[#663333]/20"
                            : "border-[#333333] hover:border-[#444444] focus:border-[#666666] focus:ring-[#666666]/20",
                    ].join(" ")}
                />
                {/* Character count */}
                <span
                    className={[
                        "absolute bottom-2.5 right-3.5 text-[10px] tabular-nums pointer-events-none select-none",
                        "transition-colors duration-150",
                        isOverLimit
                            ? "text-red-500"
                            : isNearLimit
                            ? "text-[#666666]"
                            : "text-[#333333]",
                    ].join(" ")}
                >
                    {prompt.length}/{maxLength}
                </span>
            </div>

            {/* Error message */}
            {error && (
                <p className="text-[13px] text-[#cc5555] mb-4 pl-1 leading-snug">
                    {error}
                </p>
            )}

            {/* Success message */}
            {successInfo && (
                <div className="flex items-center gap-2.5 mb-4 text-[13px] text-[#ededed]">
                    <CheckCircle2 className="w-4 h-4 text-[#1db954] shrink-0" strokeWidth={2} />
                    <span>
                        Playlist created —{" "}
                        <span className="font-medium">"{successInfo.name}"</span>
                        <span className="text-[#888888]">
                            {" · "}{successInfo.count} {successInfo.count === 1 ? "song" : "songs"}
                        </span>
                    </span>
                </div>
            )}

            {/* Action row */}
            <div className="flex items-center gap-4 flex-wrap">
                <button
                    id="ai-playlist-create-btn"
                    type="button"
                    onClick={handleGenerate}
                    disabled={isDisabled}
                    className={[
                        "inline-flex items-center gap-2",
                        "h-10 px-5 rounded-full",
                        "text-[13px] font-medium",
                        "transition-all duration-200 ease-out select-none",
                        isDisabled
                            ? "bg-[#1a1a1a] text-[#444444] border border-[#2a2a2a] cursor-not-allowed"
                            : "bg-white text-black hover:bg-gray-200 active:scale-[0.97] border border-transparent cursor-pointer",
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

                {!loading && !successInfo && !error && (
                    <span className="text-[11px] text-[#333333] hidden sm:block">
                        ⌘ Enter to generate
                    </span>
                )}
            </div>
        </div>
    );
};
