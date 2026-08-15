import { RouterProvider } from "react-router-dom"
import appRouter from "./app.routes.tsx"
import { Toaster } from "react-hot-toast"
import { useEffect, useState } from "react"
import { useAuth } from "../feature/auth/hook/authUse.tsx"
import { Loader2 } from "lucide-react"

const App = () => {
    const {handleGetCurrentUser} = useAuth()
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        handleGetCurrentUser().finally(() => {
            setIsChecking(false);
        });
    }, []);
  
    if (isChecking) {
        return (
            <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#666666] animate-spin" />
            </div>
        );
    }

    return (
        <>
            <Toaster position="top-center" />
            <RouterProvider router={appRouter} />
        </>
    )
}

export default App