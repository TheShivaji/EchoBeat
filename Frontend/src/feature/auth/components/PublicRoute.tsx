import { useSelector } from "react-redux";
import type { RootState } from "../../../app/app.store"
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
    const { loading, isAuthenticated } = useSelector(
        (state: RootState) => state.auth
    );

    if (loading) {
        return <div>Loading...</div>;
    }

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default PublicRoute;