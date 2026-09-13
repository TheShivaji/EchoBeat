import { useEffect, useRef } from "react";
import { Bot, X, Send, Trash2, Loader2, Sparkles } from "lucide-react";
import { useChat } from "../hook/useChat";

// ─── Quick suggestion chips ───────────────────────────────────────────────────
const SUGGESTIONS = [
    "Mere liked songs dikhao",
    "Arijit Singh ke top songs",
    "Ek nayi Workout playlist banao",
    "Recently played gaane batao",
];

// ─── Single chat bubble ───────────────────────────────────────────────────────
const Bubble = ({ role, content }: { role: "user" | "assistant"; content: string }) => {
    const isUser = role === "user";
    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
            {!isUser && (
                <div className="w-6 h-6 rounded-full bg-[#1ed760] flex items-center justify-center mr-2 mt-0.5 shrink-0">
                    <Bot size={12} className="text-black" />
                </div>
            )}
            <div
                className={[
                    "max-w-[78%] px-3 py-2 rounded-2xl text-[13px] leading-[1.55] whitespace-pre-wrap break-words",
                    isUser
                        ? "bg-[#2a2a2a] text-white rounded-br-sm"
                        : "bg-[#1e1e1e] text-[#d8d8d8] rounded-bl-sm border border-[#2a2a2a]",
                ].join(" ")}
            >
                {content}
            </div>
        </div>
    );
};

// ─── Typing indicator ─────────────────────────────────────────────────────────
const TypingDots = () => (
    <div className="flex justify-start mb-2">
        <div className="w-6 h-6 rounded-full bg-[#1ed760] flex items-center justify-center mr-2 mt-0.5 shrink-0">
            <Bot size={12} className="text-black" />
        </div>
        <div className="bg-[#1e1e1e] border border-[#2a2a2a] px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1">
            {[0, 1, 2].map((i) => (
                <span
                    key={i}
                    className="w-1.5 h-1.5 bg-[#888888] rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                />
            ))}
        </div>
    </div>
);

// ─── Props ────────────────────────────────────────────────────────────────────
interface EchoChatProps {
    open: boolean;
    onClose: () => void;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export const EchoChat = ({ open, onClose }: EchoChatProps) => {
    const { messages, input, setInput, isLoading, sendMessage, clearChat, bottomRef } = useChat();
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input when chat opens
    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 200);
    }, [open]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    if (!open) return null;

    return (
        <>
            {/* ── Mobile backdrop ─────────────────────────────────────────── */}
            <div
                className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[998]"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* ── Chat window ─────────────────────────────────────────────── */}
            <div
                id="echo-chat-window"
                role="dialog"
                aria-label="EchoBeats AI Assistant"
                aria-modal="true"
                className={[
                    /* Mobile: bottom sheet */
                    "fixed left-0 right-0 bottom-0 z-[999] flex flex-col",
                    "h-[88dvh] rounded-t-2xl",
                    /* Desktop: floating card bottom-right */
                    "md:left-auto md:right-5 md:bottom-5 md:w-[380px] md:h-[540px] md:rounded-2xl",
                    /* Shared */
                    "bg-[#111111] border border-[#242424] shadow-2xl shadow-black/60",
                    "overflow-hidden",
                    /* Slide-up animation */
                    "animate-in slide-in-from-bottom-4 duration-300",
                ].join(" ")}
            >
                {/* ── Header ──────────────────────────────────────────────── */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e1e] bg-[#111111] shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="relative">
                            <div className="w-8 h-8 rounded-full bg-[#1ed760] flex items-center justify-center shadow-lg shadow-[#1ed760]/20">
                                <Bot size={15} className="text-black" />
                            </div>
                            {/* Online dot */}
                            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#111111]" />
                        </div>
                        <div>
                            <p className="text-[13px] font-semibold text-[#e0e0e0] flex items-center gap-1.5">
                                Echo Agent
                                <Sparkles size={11} className="text-[#1ed760]" />
                            </p>
                            <p className="text-[10.5px] text-[#777777]">EchoBeats AI · Always on</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={clearChat}
                            title="Clear chat"
                            className="p-1.5 rounded-lg text-[#555555] hover:text-[#999999] hover:bg-[#1a1a1a] transition-colors"
                        >
                            <Trash2 size={14} />
                        </button>
                        <button
                            onClick={onClose}
                            title="Close"
                            aria-label="Close chat"
                            className="p-1.5 rounded-lg text-[#555555] hover:text-[#999999] hover:bg-[#1a1a1a] transition-colors"
                        >
                            <X size={15} />
                        </button>
                    </div>
                </div>

                {/* ── Messages ────────────────────────────────────────────── */}
                <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2 scrollbar-hidden">
                    {messages.map((msg, i) => (
                        <Bubble key={i} role={msg.role} content={msg.content} />
                    ))}
                    {isLoading && <TypingDots />}
                    <div ref={bottomRef} />
                </div>

                {/* ── Suggestions (show only when fresh) ──────────────────── */}
                {messages.length <= 1 && (
                    <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
                        {SUGGESTIONS.map((s) => (
                            <button
                                key={s}
                                onClick={() => sendMessage(s)}
                                className="text-[11.5px] text-[#999999] border border-[#2a2a2a] rounded-full px-3 py-1 hover:border-[#444444] hover:text-white hover:bg-[#1a1a1a] transition-all duration-150"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                )}

                {/* ── Input bar ───────────────────────────────────────────── */}
                <div className="px-3 pb-4 pt-2 border-t border-[#1e1e1e] shrink-0 bg-[#111111]">
                    <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 py-2 focus-within:border-[#444444] transition-colors">
                        <input
                            ref={inputRef}
                            id="echo-chat-input"
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Kuch bhi pooch…"
                            disabled={isLoading}
                            className="flex-1 bg-transparent text-[13px] text-[#d8d8d8] placeholder-[#444444] outline-none disabled:opacity-50"
                            autoComplete="off"
                        />
                        <button
                            id="echo-chat-send"
                            onClick={() => sendMessage()}
                            disabled={!input.trim() || isLoading}
                            className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors shrink-0"
                            aria-label="Send message"
                        >
                            {isLoading ? (
                                <Loader2 size={13} className="animate-spin" />
                            ) : (
                                <Send size={12} />
                            )}
                        </button>
                    </div>
                    <p className="text-center text-[10px] text-[#333333] mt-1.5">
                        Echo Agent · Powered by Gemini
                    </p>
                </div>
            </div>
        </>
    );
};
