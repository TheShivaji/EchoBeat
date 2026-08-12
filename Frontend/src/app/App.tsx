import { RouterProvider } from "react-router-dom"
import appRouter from "./app.routes.tsx"
import { Toaster } from "react-hot-toast"


const App = () => {
  return (
    <>
      <Toaster position="top-center" />
      <RouterProvider router={appRouter} />
    </>
  )
}

export default App