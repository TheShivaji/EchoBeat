import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../feature/auth/state/authSlice.ts"

const store = configureStore({
    reducer: {
        auth: authReducer
    }
})

export default store