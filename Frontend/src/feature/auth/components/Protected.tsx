import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../../../app/app.store";

interface ProtectedProps {
    requiredRole?: string;
}

export const Protected = ({ requiredRole }: ProtectedProps) => {
    const { loading, isAuthenticated, user } = useSelector(
        (state: RootState) => state.auth
    );

    if (loading) {
        return <div>loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user?.role !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};