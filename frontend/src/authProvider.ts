import type { AuthProvider, OnErrorResponse } from "@refinedev/core";
import { notification } from "antd";
import axios from "axios";
import { Role } from "./constant";
import { disableAutoLogin, enableAutoLogin } from "./hooks";

const TOKEN_KEY = "token_timperio";
const EXPIRES_IN_KEY = "token_expiry";
const EMAIL = "loggedInEmail";
const ROLE = "role";
const ROLE_CONTAINER_ID = "dynamic-role-style";
const USERPERM = "user-perm";

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

      loggedInEmail = email;

      localStorage.setItem(EMAIL, loggedInEmail);
      localStorage.setItem(TOKEN_KEY, newToken);
      localStorage.setItem(
        EXPIRES_IN_KEY,
        String(Date.now() + expiresIn * 1000)
      );
      localStorage.setItem(ROLE, role);

      notification.success({
        message: "Login Successful",
        description: "You have been logged in successfully.",
      });

      startLogoutTimer(expiresIn * 1000);

      const redirectRoute =
        role === Role.ADMIN
          ? "/userManagement"
          : role === Role.MARKETING
          ? "/purchaseHistory"
          : "/";

      return {
        success: true,
        redirectTo: redirectRoute,
      };
    } catch (error) {
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
      redirectTo: "/login",
    };
  },
  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const expiry = localStorage.getItem(EXPIRES_IN_KEY);
    const role = localStorage.getItem(ROLE);
    const injectedStyle = document.getElementById(ROLE_CONTAINER_ID);

    function filterActionsByRole(data, role) {
      // Define the desired output keys
      const resultKeys = {
        customer_page: "SEGMENT CUSTOMERS BY SPENDING",
        format_newsletter: "FORMAT NEWSLETTER TEMPLATE",
        send_newsletter: "CREATE AND SEND NEWSLETTER",
        dashboard_page: "VIEW SALES METRICS",
        view_orders: "ACCESS AND FILTER PURCHASE HISTORY",
        user_page: "MANAGE USER ACCOUNTS",
        export_data: "EXPORT FILTERED DATA",
      };

      // Map the output format with true/false values based on role inclusion
      const result = {};
      for (const [key, action] of Object.entries(resultKeys)) {
        // Find the action in the dataset
        const matchingAction = data.find((item) => item.action === action);
        // Check if the role is included in the action's roles
        result[key] = matchingAction
          ? matchingAction.role.includes(role)
          : false;
      }

      return result;
    }

    // fetch permission
    const fetchPermission = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER}/api/v1/permission`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { data } = response;
        const userPerm = filterActionsByRole(data, role);
        localStorage.setItem(USERPERM, JSON.stringify(userPerm));
        return userPerm;
        // setPermissions(data);
      } catch (err) {}
    };

    if (injectedStyle) {
      injectedStyle.remove();
    }

    if (token) {
      const userPerm = await fetchPermission();
      if (expiry && Date.now() < parseInt(expiry)) {
        const remainingTime = parseInt(expiry) - Date.now();
        startLogoutTimer(remainingTime);

        const style = document.createElement("style");
        style.id = ROLE_CONTAINER_ID;

        let hideTabsStyles = ``;
        // hide page
        if (!userPerm["customer_page"]) {
          hideTabsStyles += `
            .ant-menu li[role="menuitem"]:nth-of-type(3) {
              display: none;
            }
          `;
        }
        if (!userPerm["dashboard_page"]) {
          hideTabsStyles += `
            .ant-menu li[role="menuitem"]:nth-of-type(1) {
              display: none;
            }
          `;
        }
        if (!userPerm["user_page"]) {
          hideTabsStyles += `
            .ant-menu li[role="menuitem"]:nth-of-type(4) {
              display: none;
            }
          `;
        }
        if (!userPerm["view_orders"] && !userPerm["export_data"]) {
          hideTabsStyles += `
            .ant-menu li[role="menuitem"]:nth-of-type(2) {
              display: none;
            }
          `;
        }
        if (!userPerm["format_newsletter"] && !userPerm["send_newsletter"]) {
          hideTabsStyles += `
            .ant-menu li[role="menuitem"]:nth-of-type(6) {
              display: none;
            }
          `;
        }
        // Hide user page - only admin can see
        if (role != Role.ADMIN) {
          hideTabsStyles += `
            .ant-menu li[role="menuitem"]:nth-of-type(5) {
              display: none;
            }
          `;
        }
        style.innerHTML = hideTabsStyles;
        document.head.appendChild(style);
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
      redirectTo: "/login",
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
