import React from "react";
import { Outlet } from "react-router-dom";
import ResponsiveNavbar from "../components/Navbar";
import Footer from "../components/Footer";
import bodyBg from "../assets/HomePageImages/body-bg.jpg";

const Layout = () => {
  return (
    <div
      className="min-h-screen min-w-[320px] w-full bg-no-repeat bg-center bg-cover bg-fixed overflow-x-auto"
      style={{ backgroundImage: `url(${bodyBg})` }}
    >
      <div className="min-h-screen min-w-[320px] w-full flex flex-col relative">
        <ResponsiveNavbar />
        <main className="flex-1 w-full min-w-[320px]">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
