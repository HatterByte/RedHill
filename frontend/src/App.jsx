import { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
// import { connect } from "react-redux";
import HomePage from "./pages/HomePage";
import { getUser } from "./actions/auth.actions";
import Layout from "./utils/Layout";
import ComplaintTable from "./components/User/ComplaintTable";
import { useDispatch } from "react-redux";
import { AlertProvider } from "./utils/AlertContext";
import { LoginModalProvider } from "./utils/LoginModalContext";
import AdminApp from "./admin/AdminApp";
import NotFound from "./pages/NotFound";

function App(props) {
  const dispatch = useDispatch();
  useEffect(() => {
    console.log("App mounted");
    dispatch(getUser());
  }, [getUser]);

  return (
    <AlertProvider>
      <LoginModalProvider>
        {/* <div className="h-screen w-screen bg-[url('https://railmadad.indianrailways.gov.in/madad/final/images/body-bg.jpg')] bg-no-repeat bg-center bg-cover bg-fixed overflow-auto"> */}
        <BrowserRouter>
          <Routes>
            <Route path="/admin/*" element={<AdminApp />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} /> {/* Renders at "/" */}
              <Route path="complaints" element={<ComplaintTable />} />
              {/* <Route path="contact" element={<ContactPage />} /> */}
            </Route>
            {/* 404 Not Found Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        {/* </div> */}
      </LoginModalProvider>
    </AlertProvider>
  );
}
// const mapStateToProps = (state) => {
//   // console.log(state);
//   return {
//     user: state.auth.user,
//   };
// };

export default App;
