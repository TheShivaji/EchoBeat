import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Song } from "../../song/types/song.type";

interface PlayerState {
    currentSong: Song | null;
    isPlaying: boolean;
    volume: number;
}

const initialState: PlayerState = {
    currentSong: null,
    isPlaying: false,
    volume: 1, // Default volume to 100%
};

const playerSlice = createSlice({
    name: "player",
    initialState,
    reducers: {
        setCurrentSong: (state, action: PayloadAction<Song>) => {
            state.currentSong = action.payload;
            state.isPlaying = true; // Auto-play when a new song is selected
        },
        setIsPlaying: (state, action: PayloadAction<boolean>) => {
            state.isPlaying = action.payload;
        },
        setVolume: (state, action: PayloadAction<number>) => {
            state.volume = action.payload;
        },
        togglePlay: (state) => {
            if (state.currentSong) {
                state.isPlaying = !state.isPlaying;
            }
        },
    },
});

export const { setCurrentSong, setIsPlaying, setVolume, togglePlay } = playerSlice.actions;

export default playerSlice.reducer;
