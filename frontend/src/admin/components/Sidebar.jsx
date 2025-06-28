import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TableChartIcon from "@mui/icons-material/TableChart";
import BarChartIcon from "@mui/icons-material/BarChart";
import PeopleIcon from "@mui/icons-material/People";
import { Link } from "react-router-dom";

const navItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
  { text: "Complaints", icon: <TableChartIcon />, path: "/admin/complaints" },
  {
    text: "Classification Monitor",
    icon: <BarChartIcon />,
    path: "/admin/classification",
  },
  { text: "User History", icon: <PeopleIcon />, path: "/admin/user-history" },
];

const Sidebar = () => (
  <Drawer
    variant="permanent"
    anchor="left"
    sx={{
      width: 220,
      flexShrink: 0,
      [`& .MuiDrawer-paper`]: { width: 220, boxSizing: "border-box" },
    }}
  >
    <List>
      {navItems.map((item) => (
        <ListItem button key={item.text} component={Link} to={item.path}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
    </List>
  </Drawer>
);

export default Sidebar;
