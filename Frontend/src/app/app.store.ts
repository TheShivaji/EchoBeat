import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../feature/auth/state/authSlice.ts"
import playerReducer from "../feature/players/state/playerSlice.ts"

const store = configureStore({
    reducer: {
        auth: authReducer,
        player: playerReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;