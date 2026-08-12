import { createBrowserRouter } from "react-router-dom";
import Home from "../feature/auth/pages/Home";
import Login from "../feature/auth/pages/Login";
import Signup from "../feature/auth/pages/Singup";

const appRouter = createBrowserRouter([
    {
        path: "/",
        element: <Home />
    },
    {
        path:"/login",
        element:<Login />
    },
    {
        path:"/signup",
        element:<Signup />
    }
])

export default appRouter