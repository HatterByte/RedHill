import React, { createContext, useContext, useState, useCallback } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const AlertContext = createContext();

export const useGlobalAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
    duration: 2500,
  });

  const showAlert = useCallback(
    (message, severity = "success", duration = 2500) => {
      setAlert({ open: true, message, severity, duration });
    },
    []
  );

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setAlert((prev) => ({ ...prev, open: false }));
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <Snackbar
        open={alert.open}
        autoHideDuration={alert.duration}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ zIndex: 9999, minWidth: 200, maxWidth: 600 }}
      >
        <Alert
          onClose={handleClose}
          severity={alert.severity}
          sx={{
            width: "100%",
            fontSize: "1.1rem",
            padding: "10px 16px",
            minWidth: 200,
            maxWidth: 350,
            boxSizing: "border-box",
          }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </AlertContext.Provider>
  );
};
