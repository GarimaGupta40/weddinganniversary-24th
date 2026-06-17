import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";

import { getRouter } from "./router";

const router = getRouter();
const queryClient = new QueryClient();

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(
  <React.StrictMode>
    <RouterProvider router={router} context={{ queryClient }} />
  </React.StrictMode>,
);
