import React from "react";
import { Outlet } from "react-router-dom";
import ResponsiveNavbar from "../components/Navbar";
import Footer from "../components/Footer";

const Layout = () => {
  return (
    <div className="min-h-screen w-full bg-[url('https://railmadad.indianrailways.gov.in/madad/final/images/body-bg.jpg')] bg-no-repeat bg-center bg-cover bg-fixed overflow-auto">
      <div className="min-h-screen w-full flex flex-col">
        <ResponsiveNavbar />
        <main className="flex-1 w-full">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
