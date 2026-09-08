import React, { useEffect } from "react";
import { X, Sparkles, Languages, HeartHandshake, Smile, Loader2, Music2, Send } from "lucide-react";
import { useAILyrics } from "../hook/useAILyrics";
import type { Song } from "../../song/types/song.type";

interface AILyricsModalProps {
    isOpen: boolean;
    onClose: () => void;
    song: Song;
}

export const AILyricsModal: React.FC<AILyricsModalProps> = ({ isOpen, onClose, song }) => {
    const {
        loading,
        error,
        data,
        activeTab,
        setActiveTab,
        prompt,
        setPrompt,
        fetchLyricsAI,
        translateToHindi,
        translateToEnglish,
        explainMeaning,
        explainMood,
        submitCustomPrompt,
        reset,
    } = useAILyrics(song.id);

    // Initial load: Fetch meaning / lyrics info when modal opens
    useEffect(() => {
        if (isOpen && song.id) {
            fetchLyricsAI({ action: "explain" });
        } else {
            reset();
        }
    }, [isOpen, song.id]);

    if (!isOpen) return null;

    const artistName =
        song.artists && song.artists.length > 0
            ? song.artists.map((a) => a.name).join(", ")
            : "Unknown Artist";

    const hasTranslation = !!data?.result?.translated_lyrics;
    const hasMeaning = !!data?.result?.meaning_summary;
    const hasMood = !!data?.result?.mood_and_vibe || (data?.result?.key_themes && data.result.key_themes.length > 0);
    const hasOriginal = !!data?.song?.originalLyrics;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !loading) {
            submitCustomPrompt();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-4 md:p-6"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            <div className="bg-[#121212] border border-[#222222] rounded-2xl w-full max-w-xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* ── Header ── */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#222222] shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center shrink-0">
                            <Sparkles size={16} className="text-[#1db954]" strokeWidth={1.8} />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-[15px] font-semibold text-[#ededed] truncate leading-tight">
                                {song.title}
                            </h2>
                            <p className="text-xs text-[#888888] truncate mt-0.5">
                                {artistName} • AI Lyrics & Meaning
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[#666666] hover:text-white p-1.5 rounded-full hover:bg-[#1a1a1a] transition-colors shrink-0"
                        aria-label="Close modal"
                    >
                        <X size={18} strokeWidth={2} />
                    </button>
                </div>

                {/* ── Quick Action Pills ── */}
                <div className="px-5 pt-3.5 pb-2 flex items-center gap-2 overflow-x-auto scrollbar-hidden shrink-0">
                    <button
                        onClick={translateToHindi}
                        disabled={loading}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs font-medium text-[#b3b3b3] hover:text-white hover:border-[#444444] transition-all shrink-0 active:scale-95 disabled:opacity-50"
                    >
                        <Languages size={13} className="text-[#888]" />
                        <span>Translate to Hindi</span>
                    </button>

                    <button
                        onClick={translateToEnglish}
                        disabled={loading}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs font-medium text-[#b3b3b3] hover:text-white hover:border-[#444444] transition-all shrink-0 active:scale-95 disabled:opacity-50"
                    >
                        <Languages size={13} className="text-[#888]" />
                        <span>Translate to English</span>
                    </button>

                    <button
                        onClick={explainMeaning}
                        disabled={loading}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs font-medium text-[#b3b3b3] hover:text-white hover:border-[#444444] transition-all shrink-0 active:scale-95 disabled:opacity-50"
                    >
                        <HeartHandshake size={13} className="text-[#888]" />
                        <span>Explain Meaning</span>
                    </button>

                    <button
                        onClick={explainMood}
                        disabled={loading}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs font-medium text-[#b3b3b3] hover:text-white hover:border-[#444444] transition-all shrink-0 active:scale-95 disabled:opacity-50"
                    >
                        <Smile size={13} className="text-[#888]" />
                        <span>Mood & Themes</span>
                    </button>
                </div>

                {/* ── Natural Language Prompt Bar ── */}
                <div className="px-5 py-2 shrink-0">
                    <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] focus-within:border-[#444444] rounded-full px-3.5 py-1.5 transition-colors">
                        <Sparkles size={14} className="text-[#666666] shrink-0" />
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={loading}
                            placeholder="Ask AI: e.g. Is gaane ka meaning samjhao..."
                            className="bg-transparent text-[13px] text-[#ededed] placeholder:text-[#555555] focus:outline-none flex-1 min-w-0"
                        />
                        <button
                            onClick={submitCustomPrompt}
                            disabled={loading || !prompt.trim()}
                            className="p-1 text-[#888888] hover:text-white disabled:opacity-30 transition-colors"
                            aria-label="Submit prompt"
                        >
                            <Send size={14} />
                        </button>
                    </div>
                </div>

                {/* ── Tabs Navigation ── */}
                {data?.lyricsAvailable && (
                    <div className="flex items-center gap-1 px-5 border-b border-[#222222] pt-2 shrink-0">
                        {hasOriginal && (
                            <button
                                onClick={() => setActiveTab("original")}
                                className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                                    activeTab === "original"
                                        ? "border-white text-white"
                                        : "border-transparent text-[#777777] hover:text-[#b3b3b3]"
                                }`}
                            >
                                Original Lyrics
                            </button>
                        )}
                        {hasTranslation && (
                            <button
                                onClick={() => setActiveTab("translated")}
                                className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                                    activeTab === "translated"
                                        ? "border-white text-white"
                                        : "border-transparent text-[#777777] hover:text-[#b3b3b3]"
                                }`}
                            >
                                Translation ({data.result?.target_language || "Hindi"})
                            </button>
                        )}
                        {hasMeaning && (
                            <button
                                onClick={() => setActiveTab("meaning")}
                                className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                                    activeTab === "meaning"
                                        ? "border-white text-white"
                                        : "border-transparent text-[#777777] hover:text-[#b3b3b3]"
                                }`}
                            >
                                Meaning
                            </button>
                        )}
                        {hasMood && (
                            <button
                                onClick={() => setActiveTab("mood")}
                                className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                                    activeTab === "mood"
                                        ? "border-white text-white"
                                        : "border-transparent text-[#777777] hover:text-[#b3b3b3]"
                                }`}
                            >
                                Mood & Themes
                            </button>
                        )}
                    </div>
                )}

                {/* ── Scrollable Content Area ── */}
                <div className="p-5 overflow-y-auto flex-1 text-left min-h-[180px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Loader2 className="w-6 h-6 text-[#1db954] animate-spin mb-3" />
                            <p className="text-sm font-medium text-[#ededed]">Processing with EchoBeats AI…</p>
                            <p className="text-xs text-[#666666] mt-1">Analyzing lyrics and emotions</p>
                        </div>
                    ) : error ? (
                        <div className="p-4 rounded-xl bg-[#1f1313] border border-[#3a1a1a] text-center my-4">
                            <p className="text-xs text-[#e06666]">{error}</p>
                        </div>
                    ) : data && !data.lyricsAvailable ? (
                        /* Unavailable lyrics state — strict non-hallucination requirement */
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Music2 size={36} className="text-[#333333] mb-3" />
                            <h3 className="text-sm font-semibold text-[#ededed] mb-1">
                                Lyrics Not Available
                            </h3>
                            <p className="text-xs text-[#777777] max-w-sm leading-relaxed">
                                Lyrics are not available for this song yet. EchoBeats only explains and translates verified lyrics.
                            </p>
                        </div>
                    ) : data && data.result ? (
                        <div className="space-y-4">
                            {/* ── Tab: Translated Lyrics ── */}
                            {activeTab === "translated" && data.result.translated_lyrics && (
                                <div className="space-y-3">
                                    <div className="p-4 rounded-xl bg-[#171717] border border-[#222222]">
                                        <p className="text-sm md:text-base leading-relaxed text-[#ededed] whitespace-pre-line font-normal">
                                            {data.result.translated_lyrics}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* ── Tab: Original Lyrics ── */}
                            {activeTab === "original" && data.song?.originalLyrics && (
                                <div className="space-y-3">
                                    <div className="p-4 rounded-xl bg-[#171717] border border-[#222222]">
                                        <p className="text-sm md:text-base leading-relaxed text-[#d1d1d1] whitespace-pre-line font-normal">
                                            {data.song.originalLyrics}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* ── Tab: Meaning & Story ── */}
                            {activeTab === "meaning" && (
                                <div className="space-y-3">
                                    {data.result.meaning_summary && (
                                        <div className="p-4 rounded-xl bg-[#171717] border border-[#222222]">
                                            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1db954] mb-2">
                                                Song Meaning
                                            </h4>
                                            <p className="text-sm leading-relaxed text-[#ededed]">
                                                {data.result.meaning_summary}
                                            </p>
                                        </div>
                                    )}

                                    {data.result.poetic_breakdown && (
                                        <div className="p-4 rounded-xl bg-[#171717] border border-[#222222]">
                                            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#888888] mb-2">
                                                Poetic Breakdown
                                            </h4>
                                            <p className="text-xs md:text-sm leading-relaxed text-[#b3b3b3]">
                                                {data.result.poetic_breakdown}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── Tab: Mood & Themes ── */}
                            {activeTab === "mood" && (
                                <div className="space-y-3">
                                    {data.result.mood_and_vibe && (
                                        <div className="p-4 rounded-xl bg-[#171717] border border-[#222222]">
                                            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#888888] mb-1.5">
                                                Mood & Vibe
                                            </h4>
                                            <p className="text-sm font-medium text-[#ededed]">
                                                {data.result.mood_and_vibe}
                                            </p>
                                        </div>
                                    )}

                                    {data.result.key_themes && data.result.key_themes.length > 0 && (
                                        <div className="p-4 rounded-xl bg-[#171717] border border-[#222222]">
                                            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#888888] mb-2.5">
                                                Key Themes
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {data.result.key_themes.map((theme, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-2.5 py-1 rounded-full bg-[#222222] text-[#d1d1d1] text-xs font-medium"
                                                    >
                                                        {theme}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Sparkles size={32} className="text-[#333333] mb-2" />
                            <p className="text-xs text-[#777777]">Select an action above to translate or explain the lyrics.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AILyricsModal;
