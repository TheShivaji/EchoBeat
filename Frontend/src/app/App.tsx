import { RouterProvider } from "react-router-dom"
import appRouter from "./app.routes.tsx"
import { Toaster } from "react-hot-toast"
import { useEffect } from "react"
import { useAuth } from "../feature/auth/hook/authUse.tsx"


const App = () => {
const {handleGetCurrentUser} = useAuth()
    useEffect(() => {
    handleGetCurrentUser();
  }, []);
  
  return (
    <>
      <Toaster position="top-center" />
      <RouterProvider router={appRouter} />
    </>
  )
}

export default App