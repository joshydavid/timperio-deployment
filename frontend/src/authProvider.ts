import type { AuthProvider, OnErrorResponse } from "@refinedev/core";
import { notification } from "antd";
import axios from "axios";
import { disableAutoLogin, enableAutoLogin } from "./hooks";

export const TOKEN_KEY = "token_timperio";
export const EXPIRES_IN_KEY = "token_expiry";
export const EMAIL = "loggedInEmail";

let logoutTimer: NodeJS.Timeout | null = null;
let loggedInEmail: string;

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      enableAutoLogin();
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/v1/auth/login`,
        {
          userEmail: email,
          password: password,
        }
      );

      const { token: newToken, expiresIn, role } = response.data;
      console.log(response.data);
      
      loggedInEmail = email;
      localStorage.setItem(EMAIL, loggedInEmail);

      localStorage.setItem(TOKEN_KEY, newToken);
      localStorage.setItem(
        EXPIRES_IN_KEY,
        String(Date.now() + expiresIn * 1000)
      );

      localStorage.setItem("role", role);

      notification.success({
        message: "Login Successful",
        description: "You have been logged in successfully.",
      });

      startLogoutTimer(expiresIn * 1000);

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error) {
      // notification.error({
      //     message: 'Login Failed',
      //     description: error.response?.data?.message || 'Please check your credentials.',
      // });

      return {
        success: false,
        error: {
          message: "Login failed",
          name: "Invalid email or password",
        },
      };
    }
  },
  logout: async () => {
    clearLogoutTimer();
    disableAutoLogin();
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRES_IN_KEY);
    localStorage.removeItem(EMAIL);
    localStorage.removeItem("role");
    loggedInEmail = "";
    return {
      success: true,
      redirectTo: '/login',
    };
  },
  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const expiry = localStorage.getItem(EXPIRES_IN_KEY);

    if (token) {
      if (expiry && Date.now() < parseInt(expiry)) {
        const remainingTime = parseInt(expiry) - Date.now();
        startLogoutTimer(remainingTime);
        return { authenticated: true };
      } else {
        startLogoutTimer(0);
      }
    }

    return {
      authenticated: false,
      error: {
        message: "Check failed",
        name: "Token expired or not found",
      },
      logout: true,
      redirectTo: '/login',
    };
  },
  getIdentity: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const loggedInEmail = localStorage.getItem(EMAIL);

    if (!token || !loggedInEmail) {
      return null;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/v1/user/email/${loggedInEmail}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { userId, name } = response.data;

      return {
        id: userId,
        name: name,
        avatar: "https://i.pravatar.cc/150",
      };
    } catch (error) {
      console.error("Error fetching user identity:", error);
      return null;
    }
  },
  onError: function (error: any): Promise<OnErrorResponse> {
    throw new Error("Function not implemented.");
  },
};

const startLogoutTimer = (duration: number) => {
  clearLogoutTimer();
  logoutTimer = setTimeout(async () => {
    await authProvider.logout({});
    notification.warning({
      message: "Session Expired",
      description: "You have been logged out due to inactivity.",
    });
  }, duration);
};

const clearLogoutTimer = () => {
  if (logoutTimer) {
    clearTimeout(logoutTimer);
  }
};
