import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

import LoginWithPassWord from "./LoginWithPassword";
import LoginWithOtp from "./LoginWithOtp";
import ForgotPassword from "./ForgotPassword";

const LoginPortal = ({ setToggleLogin }) => {
  const [tabIndex, setTabIndex] = useState(0); // 0 = password, 1 = OTP
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    otp: "",
  });
  const [page, setPage] = useState(""); // empty = normal login; 'forgotPassword' = show forgot

  const reset = () => {
    setPage("");
    setFormData({
      phone: "",
      password: "",
      otp: "",
    });
    setTabIndex(0);
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    setPage("");
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Tabs */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          mb: 3,
          bgcolor: "#f0f0f0",
          borderRadius: "9999px",
          overflow: "hidden",
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="fullWidth"
          slotProps={{ indicator: { style: { display: "none" } } }}
          sx={{
            "& button": {
              fontWeight: 600,
              fontSize: "1rem",
              borderRadius: "9999px",
              px: 6,
              py: 1,
              textTransform: "none",
              color: "#75002b",
            },
            "& button.Mui-selected": {
              backgroundColor: "#75002b",
              color: "white",
            },
          }}
        >
          <Tab label="Password Login" />
          <Tab label="OTP Login" />
        </Tabs>
      </Box>

      {/* Content with fixed height */}
      <Box
        sx={{
          width: "100%",
          height: 380,
          position: "relative",
        }}
      >
        {/* Forgot Password */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: page === "forgotPassword" ? 1 : 0,
            pointerEvents: page === "forgotPassword" ? "auto" : "none",
            transition: "opacity 0.2s ease-in-out",
          }}
        >
          <ForgotPassword
            formData={formData}
            setFormData={setFormData}
            setPage={setPage}
            reset={reset}
          />
        </Box>

        {/* Password Login */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: page !== "forgotPassword" && tabIndex === 0 ? 1 : 0,
            pointerEvents:
              page !== "forgotPassword" && tabIndex === 0 ? "auto" : "none",
            transition: "opacity 0.2s ease-in-out",
          }}
        >
          <LoginWithPassWord
            formData={formData}
            setFormData={setFormData}
            setPage={setPage}
            reset={reset}
          />
        </Box>

        {/* OTP Login */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: page !== "forgotPassword" && tabIndex === 1 ? 1 : 0,
            pointerEvents:
              page !== "forgotPassword" && tabIndex === 1 ? "auto" : "none",
            transition: "opacity 0.2s ease-in-out",
          }}
        >
          <LoginWithOtp
            formData={formData}
            setFormData={setFormData}
            setPage={setPage}
            reset={reset}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPortal;
