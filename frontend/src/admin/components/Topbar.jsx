import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Tooltip,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const Topbar = ({
  adminName = "Admin",
  onLogout,
  onToggleDarkMode,
  darkMode,
}) => (
  <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
    <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        {adminName} Panel
      </Typography>
      <Box>
        <Tooltip
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          <IconButton color="inherit" onClick={onToggleDarkMode} sx={{ mr: 1 }}>
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>
        <IconButton color="inherit" onClick={onLogout}>
          <LogoutIcon />
        </IconButton>
      </Box>
    </Toolbar>
  </AppBar>
);

export default Topbar;
