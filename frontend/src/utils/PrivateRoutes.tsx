import { Outlet, Navigate } from "react-router-dom";import { useGlobalContext } from "../context/GlobalProvider";
import { useEffect } from "react";
;

const PrivateRoutes = () => {
    const { isLoggedIn, isLoading} = useGlobalContext();

    if(!isLoading)
      return isLoggedIn ? <Outlet /> : <Navigate to='/'/>;
    else
      return <div>Loading...</div>
}

export default PrivateRoutes;