import React from "react";
import { Box, Grid, Typography, Paper } from "@mui/material";
import StatCard from "../components/StatCard";
import DashboardCharts from "../components/DashboardCharts";
import ComplaintTable from "../components/ComplaintTable";

// Dummy stats
const statData = [
  { title: "Today", value: 12 },
  { title: "This Week", value: 54 },
  { title: "This Month", value: 210 },
];

// Dummy complaints
const dummyComplaints = Array.from({ length: 15 }, (_, i) => ({
  _id: `CMP${1000 + i}`,
  type: ["Cleanliness", "Security", "Delay"][i % 3],
  subtype: ["Coach", "Platform", "Other"][i % 3],
  severity: ["High", "Medium", "Low"][i % 3],
  resolved: i % 2 === 0,
  createdAt: new Date(Date.now() - i * 3600 * 1000).toISOString(),
}));

const Dashboard = () => {
  const [page, setPage] = React.useState(0);
  const rowsPerPage = 5;
  return (
    <Box p={2}>
      <Typography variant="h5" mb={2} fontWeight={600}>
        Admin Dashboard
      </Typography>
      <Grid container spacing={2} mb={2}>
        {statData.map((stat) => (
          <Grid item key={stat.title} xs={12} sm={4}>
            <StatCard title={stat.title} value={stat.value} />
          </Grid>
        ))}
      </Grid>
      <DashboardCharts />
      <Box mt={4}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="h6" mb={2} fontWeight={500}>
            Recent Complaints
          </Typography>
          <ComplaintTable
            complaints={dummyComplaints.slice(
              page * rowsPerPage,
              (page + 1) * rowsPerPage
            )}
            page={page}
            rowsPerPage={rowsPerPage}
            total={dummyComplaints.length}
            onPageChange={setPage}
            onRowClick={(row) => {}}
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;
