import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import App from "./App.tsx";
import LoginPage from "./pages/LoginPage";
import { Navigate } from "react-router-dom";

function RequireAuth({ children }: { children: React.ReactElement }) {
  const loggedIn = typeof window !== "undefined" && localStorage.getItem("ht_logged_in") === "true";
  return loggedIn ? children : <Navigate to="/" replace />;
}

const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "/dashboard", element: (
      <RequireAuth>
        <App />
      </RequireAuth>
    ) },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
