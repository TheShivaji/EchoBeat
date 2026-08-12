import { useSelector } from "react-redux"

import { Navigate, Outlet } from "react-router-dom"
import type { RootState } from "../../../app/app.store"


export const Protected = () => {
  const { loading, isAuthenticated } = useSelector((state: RootState) => state.auth)
  if (loading) {
    return <div>loading...</div>
  }
  if (isAuthenticated) {
    return <Outlet />
  } else {
    return <Navigate to="/login" />
  }

}
