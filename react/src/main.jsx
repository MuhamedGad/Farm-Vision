import React, { lazy, startTransition } from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./index.scss";

import { RecoilRoot } from "recoil";
import getCookie from "./hooks/getCookie";
import axios from "./api/axios";
const RootLayout = lazy(() => import("./layout/rootLayout"));
const Home = lazy(() => import("./pages/home"));
const Register = lazy(() => import("./pages/register"));
const PlantDiseaseApp = lazy(() => import("./pages/plant-disease-app"));
const About = lazy(() => import("./pages/about"));
const Profile = lazy(() => import("./pages/profile"));
const Dashboard = lazy(() => import("./pages/dashboard"));
const Contact = lazy(() => import("./pages/contact"));

const router = createBrowserRouter([
  {
    path: "graduation-project/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "app",
        element: <PlantDiseaseApp />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  </React.StrictMode>
);
