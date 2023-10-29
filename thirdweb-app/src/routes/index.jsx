import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import LoginPage from "../pages/LoginPage";
import MainLayout from "../components/layout/MainLayout";
import Home from "../pages/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout/>,
    children: [
      {
        index: true,
        element: <LoginPage/>
      },
      {
        path: "home",
        element: <MainLayout/>,
        children: [
        {
          index: true,
          element: <Home/>
        }
        ]
      }
    ]
  }
])