/* import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_URL,
});

const setAuthHeader = (token) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const useAuthService = () => {
  const [user, setUser] = useState(() =>
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );

  useEffect(() => {
    if (user && user.tokens && user.tokens.access) {
      setAuthHeader(user.tokens.access);
    }
  }, [user]);

  const getUserDetails = async (id) => {
    try {
      if (!user || !user.tokens || !user.tokens.access) {
        throw new Error("User is not authenticated");
      }
      const token = user.tokens.access;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await api.get(`/users/${id}`, config);
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post("/login/", {
        email,
        password,
      });
      //console.log(response);
      localStorage.setItem("user", JSON.stringify(response.data));
      setUser(response.data);
    } catch (error) {
      setUser("");
      return error;
    }
  };

  const register = async (username, email, password1, password2) => {
    try {
      const response = await api.post("/register/", {
        username,
        email,
        password1,
        password2,
      });
      //console.log(response);
    } catch (error) {
      return error.response.status;
    }
  };

  const logout = async () => {
    try {
      const accessToken = user.tokens.access;
      const refreshToken = user.tokens.refresh;

      if (accessToken && refreshToken) {
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };

        await api.post("/logout/", { refresh: refreshToken }, config);
        localStorage.removeItem("user");
        setUser(null);
        setAuthHeader("");
        return <Navigate to="/login" replace />;
      }
    } catch (error) {
      console.error("Failed to logout", error.response?.data || error.message);
    }
  };

  const isLoggedIn = () => {
    return !!localStorage.getItem("user");
  };

  const refreshAccessToken = async () => {
    try {
      if (!user || !user.tokens || !user.tokens.refresh) {
        throw new Error("No refresh token available");
      }

      const token = user.tokens.refresh;
      const response = await api.post("/token/refresh/", {
        refresh: token,
      });
      //console.log(response);

      const updatedUser = { ...user, tokens: response.data };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setAuthHeader(response.data.access);
      return response.data.access;
    } catch (refreshError) {
      return console.log(refreshError);
    }
  };

  const getAllUsers = async () => {
    try {
      if (!user || !user.tokens || !user.tokens.access) {
        throw new Error("User is not authenticated");
      }

      const token = user.tokens.access;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await api.get("/users/", config);
      const usersDetails = response.data;
      //console.log(usersDetails);
      return usersDetails;
    } catch (error) {
      return error;
    }
  };

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const newToken = await refreshAccessToken();
        if (newToken) {
          setAuthHeader(newToken);
          window.location.reload();
          return api(originalRequest);
        }
      }
      return Promise.reject(error);
    }
  );

  return {
    login,
    logout,
    register,
    getUserDetails,
    isLoggedIn,
    user,
    refreshAccessToken,
    getAllUsers,
  };
};
 */

import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Use named import for jwt-decode
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/api";

// Axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
});

// Function to set Authorization header with the token
const setAuthHeader = (token) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

// Function to check if the token is expired
const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Current time in seconds
    return decoded.exp < currentTime; // Return true if token is expired
  } catch (error) {
    console.error("Failed to decode token", error);
    return true; // Consider token expired if decoding fails
  }
};

export const useAuthService = () => {
  // State to store authenticated user and token information
  const [user, setUser] = useState(() =>
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );

  // UseEffect to set auth header on initial load if the access token is valid
  useEffect(() => {
    if (user && user.tokens && !isTokenExpired(user.tokens.access)) {
      setAuthHeader(user.tokens.access);
    }
  }, [user]);

  // Function to check if the user is logged in by validating the token
  const isLoggedIn = () => {
    if (!user || !user.tokens || !user.tokens.access) {
      return false;
    }

    // Check if access token is expired
    const tokenExpired = isTokenExpired(user.tokens.access);

    if (tokenExpired) {
      console.log("Token expired, user needs to re-authenticate");
      return false;
    }

    return true;
  };

  // Login function
  const login = async (email, password) => {
    try {
      const response = await api.post("/login/", {
        email,
        password,
      });

      // Store user data in localStorage and set auth state
      localStorage.setItem("user", JSON.stringify(response.data));
      setUser(response.data);
      setAuthHeader(response.data.tokens.access);
    } catch (error) {
      setUser(null);
      return error;
    }
  };

  // Register function
  const register = async (username, email, password1, password2) => {
    try {
      const response = await api.post("/register/", {
        username,
        email,
        password1,
        password2,
      });

      // Optionally handle successful registration

      return response.data;
    } catch (error) {
      return error.response.status;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const refreshToken = user.tokens.refresh;
      if (refreshToken) {
        const config = {
          headers: {
            Authorization: `Bearer ${user.tokens.access}`,
          },
        };

        // Invalidate the refresh token by sending it to the logout endpoint
        await api.post("/logout/", { refresh: refreshToken }, config);
        localStorage.removeItem("user");
        setUser(null);
        setAuthHeader("");
        return <Navigate to="/login" replace />;
      }
    } catch (error) {
      console.error("Failed to logout", error.response?.data || error.message);
    }
  };

  // Refresh access token function
  const refreshAccessToken = async () => {
    try {
      if (!user || !user.tokens || !user.tokens.refresh) {
        throw new Error("No refresh token available");
      }

      const token = user.tokens.refresh;
      const response = await api.post("/token/refresh/", {
        refresh: token,
      });

      // Update tokens in authState and localStorage
      const updatedUser = { ...user, tokens: response.data };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setAuthHeader(response.data.access);
      return response.data.access;
    } catch (error) {
      // Logout the user if refresh token is invalid
      logout();
      console.error("Failed to refresh access token:", error);
    }
  };

  // Get details for a specific user by ID
  const getUserDetails = async (id) => {
    try {
      if (!user || !user.tokens || !user.tokens.access) {
        throw new Error("User is not authenticated");
      }

      // Check if token is about to expire, refresh it if necessary
      if (isTokenExpired(user.tokens.access)) {
        await refreshAccessToken();
      }

      const token = user.tokens.access;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await api.get(`/users/${id}`, config);
      return response.data;
    } catch (error) {
      return error;
    }
  };

  // Get all users (excluding current user)
  const getAllUsers = async () => {
    try {
      if (!user || !user.tokens || !user.tokens.access) {
        throw new Error("User is not authenticated");
      }

      // Check if token is about to expire, refresh it if necessary
      if (isTokenExpired(user.tokens.access)) {
        await refreshAccessToken();
      }

      const token = user.tokens.access;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await api.get("/users/", config);
      return response.data; // Return list of users
    } catch (error) {
      return error;
    }
  };

  // Axios interceptor to automatically refresh tokens on 401 (Unauthorized) error
  api.interceptors.response.use(
    (response) => response, // Pass through success responses
    async (error) => {
      const originalRequest = error.config;

      // If the response is 401 (Unauthorized) and the request hasn't been retried yet
      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        // Attempt to refresh the access token
        const newToken = await refreshAccessToken();
        if (newToken) {
          setAuthHeader(newToken); // Set the new access token in headers
          return api(originalRequest); // Retry the original request with new token
        }
      }

      return Promise.reject(error); // Pass on the error if the token refresh fails
    }
  );

  // Expose the auth service methods and state
  return {
    login,
    logout,
    register,
    isLoggedIn,
    refreshAccessToken,
    getUserDetails,
    getAllUsers,
    user, // Expose user to check user details
  };
};
