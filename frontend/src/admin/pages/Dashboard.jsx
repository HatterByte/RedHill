import React from "react";
import { Box, Grid } from "@mui/material";
import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";
import Heatmap from "../components/Heatmap";
import BarChartIcon from "@mui/icons-material/BarChart";
import TableChartIcon from "@mui/icons-material/TableChart";
import PeopleIcon from "@mui/icons-material/People";

const Dashboard = () => {
  // Dummy stats
  const stats = [
    {
      title: "Total Complaints",
      value: 1200,
      icon: <TableChartIcon color="primary" />,
    },
    { title: "Resolved", value: 900, icon: <BarChartIcon color="success" /> },
    { title: "Users", value: 350, icon: <PeopleIcon color="info" /> },
  ];
  return (
    <Box p={3}>
      <Grid container spacing={2} mb={2}>
        {stats.map((stat) => (
          <Grid item key={stat.title} xs={12} sm={4}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <ChartCard title="Complaints Over Time">
            {/* Chart.js or Recharts can be used here */}
            <Box
              height={200}
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="grey.500"
            >
              [Chart Placeholder]
            </Box>
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <Heatmap />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
