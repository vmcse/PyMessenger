import { Navigate } from "react-router-dom";
import { useAuthServiceContext } from "../auth/AuthContext";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuthServiceContext();

  return isLoggedIn() ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
