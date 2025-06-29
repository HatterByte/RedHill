import React, { useMemo, useState, createContext, useContext } from "react";
import {
  Box,
  Toolbar,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const AdminThemeContext = createContext();
export const useAdminTheme = () => useContext(AdminThemeContext);

const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === "dark" ? "#e0e0e0" : "#75002b", // Light gray in dark mode, maroon in light
      },
      secondary: {
        main: "#f9c846", // RailMadad yellow
      },
      background: {
        default: mode === "dark" ? "#18181b" : "#f5f6fa",
        paper: mode === "dark" ? "#23232a" : "#fff",
      },
    },
    typography: {
      fontFamily: 'Inter, "Segoe UI", Arial, sans-serif',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            ...(mode === "dark" && {
              color: "#18181b", // dark text on light gray
              backgroundColor: "#e0e0e0",
              "&:hover": {
                backgroundColor: "#bdbdbd",
              },
            }),
          },
        },
      },
    },
  });

const AdminLayout = ({ children }) => {
  const [mode, setMode] = useState("light");
  const theme = useMemo(() => getTheme(mode), [mode]);
  const toggleDarkMode = () =>
    setMode((m) => (m === "light" ? "dark" : "light"));

  return (
    <AdminThemeContext.Provider value={{ mode, toggleDarkMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: "flex" }}>
          {/* Sidebar with padding top to offset AppBar */}
          <Sidebar listProps={{ sx: { pt: 8 } }} />
          <Box
            sx={{
              flexGrow: 1,
              ml: "220px",
              minHeight: "100vh",
              bgcolor: "background.default",
              pt: 8, // offset for AppBar height
            }}
          >
            <Topbar
              onToggleDarkMode={toggleDarkMode}
              darkMode={mode === "dark"}
            />
            {/* <Toolbar /> Spacer removed, handled by pt */}
            <Box p={2}>{children}</Box>
          </Box>
        </Box>
      </ThemeProvider>
    </AdminThemeContext.Provider>
  );
};

export default AdminLayout;
