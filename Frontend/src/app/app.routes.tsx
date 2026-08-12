import { createBrowserRouter } from "react-router-dom";
import Home from "../feature/home/pages/Home";
import Login from "../feature/auth/pages/Login";
import Signup from "../feature/auth/pages/Singup";
import { Protected } from "../feature/auth/components/Protected";
import Applayout from "../feature/auth/layout/Applayout";
import PublicRoute from "../feature/auth/components/PublicRoute";
import NotFound from "../feature/auth/pages/NotFound";

const appRouter = createBrowserRouter([
    {
        element: <PublicRoute />,
        children: [
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/register",
                element: <Signup />,
            },
        ],
    },
    {
        element: <Protected />,
        children: [
            {
                element: <Applayout />,
                children: [
                    {
                        path: "/",
                        element: <Home />
                    }
                ]
            }
        ]
    },
    {
        path: "*",
        element: <NotFound />
    }
])

export default appRouter