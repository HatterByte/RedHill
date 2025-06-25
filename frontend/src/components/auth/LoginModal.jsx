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
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: 500,
          px: 3,
          py: 4,
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
        }}
      >
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
            TabIndicatorProps={{ style: { display: "none" } }}
            sx={{
              "& button": {
                fontWeight: 600,
                fontSize: "1rem",
                borderRadius: "9999px",
                px: 2,
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

        {/* Content */}
        <Box sx={{ width: "100%" }}>
          {page === "forgotPassword" ? (
            <ForgotPassword
              formData={formData}
              setFormData={setFormData}
              setPage={setPage}
              reset={reset}
            />
          ) : tabIndex === 0 ? (
            <LoginWithPassWord
              formData={formData}
              setFormData={setFormData}
              setPage={setPage}
              reset={reset}
            />
          ) : (
            <LoginWithOtp
              formData={formData}
              setFormData={setFormData}
              setPage={setPage}
              reset={reset}
            />
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPortal;
