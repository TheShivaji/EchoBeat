import { useDispatch } from "react-redux";
import { setUser, setError, setLoading } from "../state/authSlice";
import {
    getCurrentUser,
    loginApi,
    registerApi
} from "../api/auth.api";
import type {
    SignupUser,
    LoginUser,
    AuthApiResponse
} from "../types/auth.types";
import toast from "react-hot-toast";



const getErrorMessage = (error: unknown): string => {
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

    const handleSignup = async (user: SignupUser) => {
        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            const res = await registerApi(user);

            if (res?.success) {
                handleAuthSuccess(res);
            }
        } catch (error) {
            handleAuthError(error);
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleLogin = async (user: LoginUser) => {
        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            const res = await loginApi(user);

            if (res?.success) {
                handleAuthSuccess(res);
            }
        } catch (error) {
            handleAuthError(error);
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleGetCurrentUser = async () => {
        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            const res = await getCurrentUser();

            if (res?.success) {
                handleAuthSuccess(res);
            }
        } catch (error) {
            handleAuthError(error);
        } finally {
            dispatch(setLoading(false));
        }
    };

    return {
        handleLogin,
        handleSignup,
        handleGetCurrentUser
    };
};