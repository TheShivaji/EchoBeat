import { useState, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../app/app.store";
import type { User } from "../../auth/types/auth.types";
import { sendChatMessageAPI, type ChatMessage } from "../api/ai.api";
import { setCurrentSong } from "../../players/state/playerSlice";

export const useChat = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user) as
        | (User & { id?: string })
        | null;

    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            role: "assistant",
            content:
                "Hey! 👋 Main EchoBeats ka AI assistant hoon. Aapke liked songs, playlists, ya koi bhi music request — bas boliye! 🎵",
            timestamp: Date.now(),
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    };

    const sendMessage = useCallback(
        async (text?: string) => {
            const content = (text ?? input).trim();
            if (!content || isLoading) return;

            const userMsg: ChatMessage = { role: "user", content, timestamp: Date.now() };
            setMessages((prev) => [...prev, userMsg]);
            setInput("");
            setIsLoading(true);
            scrollToBottom();

            try {
                const res = await sendChatMessageAPI({
                    message: content,
                    user_id: user?.id,
                });

                const assistantMsg: ChatMessage = {
                    role: "assistant",
                    content: res.reply,
                    timestamp: Date.now(),
                };
                setMessages((prev) => [...prev, assistantMsg]);

                // If a playlist was actually created, show a success notification
                if (res.playlist) {
                    setMessages((prev) => [
                        ...prev,
                        {
                            role: "assistant",
                            content: `✅ **"${res.playlist.name}"** playlist successfully ban gayi! Aap apni playlists mein ja ke dekh sakte hain. 🎶`,
                            timestamp: Date.now(),
                        },
                    ]);
                }

                if (res.play_song) {
                    dispatch(setCurrentSong({ song: res.play_song, queue: [res.play_song] }));
                }
            } catch {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content: "Oops! Kuch gadbad ho gayi. Thodi der baad try karo. 🙏",
                        timestamp: Date.now(),
                    },
                ]);
            } finally {
                setIsLoading(false);
                scrollToBottom();
            }
        },
        [input, isLoading, user]
    );

    const clearChat = () => {
        setMessages([
            {
                role: "assistant",
                content: "Chat clear ho gaya! Kya naya poochna hai? 🎵",
                timestamp: Date.now(),
            },
        ]);
    };

    return {
        messages,
        input,
        setInput,
        isLoading,
        sendMessage,
        clearChat,
        bottomRef,
    };
};
