import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../app/app.store";
import { setIsPlaying, setVolume, setCurrentSong } from "../state/playerSlice";
import { recordPlayHistory } from "../api/history.api";

interface PlayerContextType {
    currentTime: number;
    duration: number;
    audioRef: React.RefObject<HTMLAudioElement>;
    progressBarRef: React.RefObject<HTMLDivElement>;
    togglePlay: () => void;
    handleSeek: (event: React.MouseEvent<HTMLDivElement>) => void;
    handleVolumeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    toggleMute: () => void;
    nextSong: () => void;
    previousSong: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const usePlayerContext = () => {
    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error("usePlayerContext must be used within a PlayerProvider");
    }
    return context;
};

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useDispatch();

    const currentSong = useSelector((state: RootState) => state.player.currentSong);
    const isPlaying = useSelector((state: RootState) => state.player.isPlaying);
    const volume = useSelector((state: RootState) => state.player.volume);
    const queue = useSelector((state: RootState) => state.player.queue);
    const currentIndex = useSelector((state: RootState) => state.player.currentIndex);

    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // Refs
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const volumeRef = useRef(1);
    const progressBarRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentSong) return;

        if (audio.src !== currentSong.audioUrl) {
            audio.pause();
            audio.src = currentSong.audioUrl;
            audio.currentTime = 0;
            setCurrentTime(0);
            audio.load();
            
            // Record play history
            recordPlayHistory(currentSong.id);
        }

        audio.volume = volume;

        if (isPlaying) {
            audio.play().catch((err) => {
                console.error("Playback failed:", err);
                dispatch(setIsPlaying(false));
            });
        }
    }, [currentSong, isPlaying, dispatch]);

    // Handle Volume Change from Redux
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // Audio Event Handlers
    const handlePlayEvent = () => dispatch(setIsPlaying(true));
    const handlePauseEvent = () => dispatch(setIsPlaying(false));

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleEnded = () => {
        dispatch(setIsPlaying(false));
    };

    // Actions
    const togglePlay = () => {
        if (!currentSong || !audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(console.error);
        }
    };

    const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
        const audio = audioRef.current;
        const progressBar = progressBarRef.current;
        if (!audio || !progressBar || !duration) return;

        const rect = progressBar.getBoundingClientRect();
        const clickPosition = event.clientX - rect.left;
        const percentage = clickPosition / rect.width;
        const newTime = Math.max(0, Math.min(percentage * duration, duration)); // Clamping

        audio.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = Number(event.target.value) / 100;
        dispatch(setVolume(newVolume));
        if (newVolume > 0) {
            volumeRef.current = newVolume;
        }
    };

    const toggleMute = () => {
        if (volume > 0) {
            volumeRef.current = volume;
            dispatch(setVolume(0));
        } else {
            dispatch(setVolume(volumeRef.current));
        }
    };

    const nextSong = () => {
        let newIndex: number;

        if (currentIndex === queue.length - 1) {
            newIndex = 0;
        } else {
            newIndex = currentIndex + 1;
        }

        const nextS = queue[newIndex];

        dispatch(
            setCurrentSong({
                song: nextS,
                queue: [...queue],
            })
        );
    };

    const previousSong = () => {
        let newIndex: number;
        if (currentIndex === 0) {
            newIndex = queue.length - 1
        } else {
            newIndex = currentIndex - 1
        }
        const previous = queue[newIndex]
        dispatch(
            setCurrentSong({
                song: previous,
                queue: [...queue],
            })
        );
    };


    const contextValue = {
        currentTime,
        duration,
        audioRef,
        progressBarRef,
        togglePlay,
        handleSeek,
        handleVolumeChange,
        toggleMute,
        nextSong,
        previousSong
    };

    return (
        <PlayerContext.Provider value={contextValue}>
            {children}
            {/* Exactly ONE global audio element */}
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={handlePlayEvent}
                onPause={handlePauseEvent}
                onEnded={handleEnded}
            />
        </PlayerContext.Provider>
    );
};
