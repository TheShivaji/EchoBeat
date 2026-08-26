import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Song } from "../../song/types/song.type";

interface PlayerState {
    currentSong: Song | null;
    isPlaying: boolean;
    volume: number;
    queue: Song[];
    currentIndex: number;
}

interface SetCurrentSongPayload {
    song: Song;
    queue: Song[];
}

const initialState: PlayerState = {
    currentSong: null,
    isPlaying: false,
    volume: 1, // Default volume to 100%
    queue: [],
    currentIndex: 0
};

const playerSlice = createSlice({
    name: "player",
    initialState,
    reducers: {
        setCurrentSong: (state, action: PayloadAction<SetCurrentSongPayload>) => {
            const newQueue = action.payload.queue ?? [];
            state.queue = newQueue;
            state.currentIndex = newQueue.findIndex(
                item => item.id === action.payload.song.id
            );
            state.currentSong = action.payload.song;
            state.isPlaying = true;
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
