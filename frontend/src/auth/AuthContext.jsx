import React, { createContext, useContext } from "react";
import { useAuthService } from "./AuthServices";

const AuthServiceContext = createContext(null);

export const AuthServiceProvider = ({ children }) => {
  const authServices = useAuthService();

  return (
    <AuthServiceContext.Provider value={authServices}>
      {children}
    </AuthServiceContext.Provider>
  );
};

export const useAuthServiceContext = () => {
  const context = useContext(AuthServiceContext);

  if (context === null) {
    throw new Error(
      "useAuthServiceContext must be used within a AuthServiceProvider"
    );
  }

  return context;
};

export default AuthServiceProvider;
