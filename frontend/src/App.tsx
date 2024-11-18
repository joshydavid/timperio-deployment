import {
  DashboardOutlined,
  LockOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  ErrorComponent,
  ThemedLayoutV2,
  useNotificationProvider,
} from "@refinedev/antd";
import { Authenticated, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import jsonServerDataProvider from "@refinedev/simple-rest";
import React from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { authProvider } from "./authProvider";

import "dayjs/locale/de";

import { useTranslation } from "react-i18next";
import { Header, Title } from "./components";
import { ConfigProvider } from "./context";
import { useAutoLoginForDemo } from "./hooks";
import { AuthPage } from "./pages/auth";
import { CustomerList, CustomerShow } from "./pages/customers";
import { DashboardPage } from "./pages/dashboard";
import { OrderList, OrderShow } from "./pages/orders";
import { NewsLetter } from "./pages/newsletter";
import { CourierCreate, CourierEdit, UserManagement } from "./pages/users";

import "@refinedev/antd/dist/reset.css";
import { PermissionManagement } from "./pages/permission";

const App: React.FC = () => {
  const { loading } = useAutoLoginForDemo();

  const API_URL = "";
  const dataProvider = jsonServerDataProvider(API_URL);

  const { t, i18n } = useTranslation();

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  if (loading) {
    return null;
  }

  return (
    <BrowserRouter>
      <ConfigProvider>
        <RefineKbarProvider>
          <Refine
            routerProvider={routerProvider}
            dataProvider={dataProvider}
            authProvider={authProvider}
            i18nProvider={i18nProvider}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
            }}
            notificationProvider={useNotificationProvider}
            resources={[
              {
                name: "dashboard",
                list: "/",
                meta: {
                  label: "Dashboard",
                  // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                  icon: <DashboardOutlined />,
                },
              },
              {
                name: "orders",
                list: "/purchaseHistory",
                meta: {
                  // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                  icon: <ShoppingOutlined />,
                },
              },
              {
                name: "users",
                list: "/customers",
                show: "/customers/:id",
                meta: {
                  // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                  icon: <UserOutlined />,
                },
              },
              {
                name: "Users",
                list: "/userManagement",
                create: "/userManagement/new",
                edit: "/userManagement/:id/edit",
                show: "/userManagement/:id",
                meta: {
                  // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                  icon: <UserOutlined />,
                },
              },
              {
                name: "Permission",
                list: "/permission",
                show: "/customers/:id",
                meta: {
                  // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                  icon: <LockOutlined />,
                },
              },
              {
                name: "newsletter",
                list: "/newsletter",
                show: "/newsletter",
                meta: {
                  // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                  icon: <UserOutlined />,
                },
              },
              {
                name: "newsletter",
                list: "/newsletter",
                show: "/newsletter",
                meta: {
                  // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                  icon: <UserOutlined />,
                },
              },
            ]}
          >
            <Routes>
              <Route
                element={
                  <Authenticated
                    key="authenticated-routes"
                    fallback={<CatchAllNavigate to="/login" />}
                  >
                    <ThemedLayoutV2 Header={Header} Title={Title}>
                      <div
                        style={{
                          maxWidth: "1200px",
                          marginLeft: "auto",
                          marginRight: "auto",
                        }}
                      >
                        <Outlet />
                      </div>
                    </ThemedLayoutV2>
                  </Authenticated>
                }
              >
                <Route index element={<DashboardPage />} />

                <Route path="/purchaseHistory">
                  <Route index element={<OrderList />} />
                  <Route path=":id" element={<OrderShow />} />
                </Route>

                <Route path="/customers" element={<CustomerList />}>
                  <Route path=":id" element={<CustomerShow />} />
                </Route>

                <Route path="/newsletter" element={<NewsLetter />}>
                  <Route element={<NewsLetter />} />
                </Route>

                <Route path="/userManagement">
                  <Route path="" element={<UserManagement />}>
                    <Route path="new" element={<CourierCreate />} />
                  </Route>

                  <Route path=":id/edit" element={<CourierEdit />} />
                </Route>

                <Route path="/permission">
                  <Route path="" element={<PermissionManagement />} />
                </Route>
              </Route>

              <Route
                element={
                  <Authenticated key="auth-pages" fallback={<Outlet />}>
                    <NavigateToResource resource="dashboard" />
                  </Authenticated>
                }
              >
                <Route
                  path="/login"
                  element={
                    <AuthPage
                      type="login"
                      formProps={{
                        initialValues: {
                          email: "",
                          password: "",
                        },
                      }}
                    />
                  }
                />
                <Route
                  path="/register"
                  element={
                    <AuthPage
                      type="register"
                      formProps={{
                        initialValues: {
                          email: "",
                          password: "",
                        },
                      }}
                    />
                  }
                />
                <Route
                  path="/forgot-password"
                  element={<AuthPage type="forgotPassword" />}
                />
                <Route
                  path="/update-password"
                  element={<AuthPage type="updatePassword" />}
                />
              </Route>

              <Route
                element={
                  <Authenticated key="catch-all">
                    <ThemedLayoutV2 Header={Header} Title={Title}>
                      <Outlet />
                    </ThemedLayoutV2>
                  </Authenticated>
                }
              >
                <Route path="*" element={<ErrorComponent />} />
              </Route>
            </Routes>
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
            <RefineKbar />
          </Refine>
        </RefineKbarProvider>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export default App;
