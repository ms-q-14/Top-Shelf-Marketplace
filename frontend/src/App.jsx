import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Home from "./pages/Home/index";
import Products from "./pages/Products/index";
import Product from "./pages/Product/index";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import About from "./pages/About/index";
import Login from "./pages/Login/index";
import Register from "./pages/Register/index";
import Sell from "./pages/Sell/index";
import "./App.css";
import Profile from "./pages/Profile";
import IndividualProduct from "./pages/IndividualProduct";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cart from "./pages/Cart";
import VideoPlayer from "./pages/Streams/VideoPlayer";
import Auctions from "./pages/Auctions";
// import LivestreamChat from "./pages/Streams/LiveStreamChat";

const Layout = () => {
  return (
    <div className="app">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

const LoginPage = () => {
  return (
    <div className="app">
      <Login />
    </div>
  );
};

const RegisterPage = () => {
  return (
    <div className="app">
      <Register />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/product/:id",
        element: <IndividualProduct />,
      },
      {
        path: "/product/",
        element: <Product />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/sell",
        element: <Sell />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/stream",
        element: <VideoPlayer />,
      },
      {
        path: "/auctions",
        element: <Auctions />,
      },
      // {
      //   path: "/chat",
      //   element: <LivestreamChat />,
      // },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
    children: [
      {
        element: <Login />,
      },
    ],
  },
  {
    path: "/register",
    element: <RegisterPage />,
    children: [
      {
        element: <Register />,
      },
    ],
  },
]);

function App() {
  return (
    <div className="page_container">
      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
