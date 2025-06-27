import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import LoginModal from "./LoginModal";
import CreateAccount from "./CreateAccount";

const Auth = ({ setOpenLogin, toggleLogin, setToggleLogin }) => {
  const [tab, setTab] = useState(toggleLogin ? 1 : 0);
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setToggleLogin(newValue === 1); // 0 = login, 1 = signup
  };

  return (
    <>
      {/* Blurred Background */}
      <div
        className="fixed bg-black/70 backdrop-blur-sm h-screen w-screen z-40"
        onClick={() => setOpenLogin(false)}
      />

      {/* Centered Auth Box */}
      <Box
        className="fixed z-50"
        sx={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          position: "fixed",
          width: "90vw",
          maxWidth: 450,
          height: 650,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            px: 4,
            py: 3,
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "100%",
          }}
        >
          {/* Fancy MUI Tabs as buttons */}
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
              value={tab}
              onChange={handleTabChange}
              variant="fullWidth"
              slotProps={{ indicator: { style: { display: "none" } } }}
              sx={{
                "& button": {
                  fontWeight: 600,
                  fontSize: "1rem",
                  borderRadius: "9999px",
                  px: 5,
                  py: 1,
                  textTransform: "none",
                  color: "#75002b",
                  transition: "0.3s ease",
                },
                "& button.Mui-selected": {
                  backgroundColor: "#75002b",
                  color: "white",
                },
              }}
            >
              <Tab label="Complaint Login" />
              <Tab label="Create Account" />
            </Tabs>
          </Box>

          {/* Conditional Rendering of Forms */}
          <Box
            sx={{
              width: "100%",
              flex: 1,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                overflowY: "auto",
                px: 1,
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "transparent",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#d1d5db",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  background: "#9ca3af",
                },
              }}
            >
              {!tab && <LoginModal setToggleLogin={setToggleLogin} />}
              {tab === 1 && (
                <CreateAccount
                  reset={() => {
                    setTab(0);
                    setToggleLogin(false);
                  }}
                />
              )}
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default Auth;
