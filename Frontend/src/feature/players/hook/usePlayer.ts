import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../app/app.store";
import { usePlayerContext } from "../context/PlayerProvider";
import { clearPlayer as clearPlayerAction } from "../state/playerSlice";

export const usePlayer = () => {
    const dispatch = useDispatch();
    const currentSong = useSelector((state: RootState) => state.player.currentSong);
    const isPlaying = useSelector((state: RootState) => state.player.isPlaying);
    const volume = useSelector((state: RootState) => state.player.volume);

    const {
        currentTime,
        duration,
        audioRef,
        progressBarRef,
        togglePlay,
        handleSeek,
        handleVolumeChange,
        toggleMute,
        nextSong,
        previousSong,
    } = usePlayerContext();

    return {
        currentSong,
        isPlaying,
        volume,
        currentTime,
        duration,
        audioRef,
        progressBarRef,
        togglePlay,
        handleSeek,
        handleVolumeChange,
        toggleMute,
        nextSong,
        previousSong,
        clearPlayer: () => dispatch(clearPlayerAction()),
    };
};
