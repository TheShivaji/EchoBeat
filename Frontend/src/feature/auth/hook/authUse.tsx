import { useDispatch } from "react-redux";
import { setUser, setError, setLoading, logout } from "../state/authSlice";
import {
    getCurrentUser,
    loginApi,
    registerApi,
    logoutApi
} from "../api/auth.api";
import type {
    SignupUser,
    LoginUser,
    AuthApiResponse
} from "../types/auth.types";
import toast from "react-hot-toast";
import axios from "axios";



const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
        return error.response.data.message;
    }
    if (error instanceof Error) {
        return error.message;
    }

    return "Something went wrong";
};

export const useAuth = () => {
    const dispatch = useDispatch();

    const handleAuthSuccess = (data: AuthApiResponse) => {
        dispatch(setUser(data.user));
        toast.success(data.message);
    };

    const handleAuthError = (error: unknown) => {
        const errorMsg = getErrorMessage(error);

        dispatch(setError(errorMsg));
        toast.error(errorMsg);
    };

    const handleSignup = async (user: SignupUser): Promise<boolean> => {
        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            const res = await registerApi(user);

            if (res?.success) {
                handleAuthSuccess(res);
                return true;
            }
        } catch (error) {
            handleAuthError(error);
        } finally {
            dispatch(setLoading(false));
        }
        return false;
    };

    const handleLogin = async (user: LoginUser): Promise<boolean> => {
        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            const res = await loginApi(user);

            if (res?.success) {
                handleAuthSuccess(res);
                return true;
            }
        } catch (error) {
            handleAuthError(error);
        } finally {
            dispatch(setLoading(false));
        }
        return false;
    };

    const handleGetCurrentUser = async () => {
        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            const res = await getCurrentUser();

            if (res?.success) {
                // Silently set user — no toast on auto-login
                dispatch(setUser(res.user));
            }
        } catch (error) {
            // 401 means user is simply not logged in — expected, no toast
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                return;
            }
            // Any other unexpected error — show toast
            handleAuthError(error);
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleLogout = async () => {
        dispatch(setLoading(true));
        try {
            await logoutApi();
            dispatch(logout());
            toast.success("Logged out successfully");
        } catch (error) {
            handleAuthError(error);
        } finally {
            dispatch(setLoading(false));
        }
    };

    return {
        handleLogin,
        handleSignup,
        handleGetCurrentUser,
        handleLogout
    };
};