import React from "react";
import ReactDOM from "react-dom/client";
import "./main.css";
import MainProvider from "./contexts/providers/mainProvider.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import Welcome from "./views/welcome";
import Live from "./views/live";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Welcome /> },
      { path: "/room/:roomId", element: <Live /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <MainProvider>
    <RouterProvider router={router} />
  </MainProvider>
);
