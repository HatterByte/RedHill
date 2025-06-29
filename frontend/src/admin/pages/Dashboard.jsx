import React from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import StatCard from "../components/StatCard";
import DashboardCharts from "../components/DashboardCharts";
import ComplaintTable from "../components/ComplaintTable";
import AdminComplaintModal from "../components/AdminComplaintModal";
import api from "../utils/api";

const statFilters = [
  { label: "Today", value: "daily" },
  { label: "This Week", value: "weekly" },
  { label: "This Month", value: "monthly" },
  { label: "All Time", value: "all" },
];

const Dashboard = () => {
  const [filter, setFilter] = React.useState("daily");
  const [stats, setStats] = React.useState({
    total: 0,
    resolved: 0,
    pending: 0,
  });
  const [topTypes, setTopTypes] = React.useState([]);
  const [complaints, setComplaints] = React.useState([]);
  const [totalComplaints, setTotalComplaints] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [loading, setLoading] = React.useState(false);
  const [selectedComplaint, setSelectedComplaint] = React.useState(null);

  React.useEffect(() => {
    setLoading(true);
    // Fetch stats and top types
    const fetchStats = async () => {
      try {
        // Get all complaints for filter
        const params = { page: page + 1, limit: rowsPerPage };
        if (filter !== "all") params.dateRange = filter;
        const res = await api.get(`/complaints`, { params });
        const data = res.data.complaints;
        setTotalComplaints(res.data.total);
        setComplaints(data);
        // Calculate resolved/pending
        let resolved = 0,
          pending = 0;
        data.forEach((c) => (c.resolved ? resolved++ : pending++));
        setStats({ total: res.data.total, resolved, pending });
      } catch (e) {
        setStats({ total: 0, resolved: 0, pending: 0 });
        setComplaints([]);
      }
    };
    const fetchTopTypes = async () => {
      try {
        const res = await api.get(`/complaints-stats/top-types`, {
          params: { limit: 5 },
        });
        setTopTypes(res.data.topTypes || []);
      } catch (e) {
        setTopTypes([]);
      }
    };
    fetchStats();
    fetchTopTypes();
    setLoading(false);
  }, [filter, page, rowsPerPage]);

  // Reset page to 0 when filter or rowsPerPage changes
  React.useEffect(() => {
    setPage(0);
  }, [filter, rowsPerPage]);

  return (
    <Box p={2}>
      <Typography variant="h5" mb={2} fontWeight={600}>
        Admin Dashboard
      </Typography>
      <Box mb={2} display="flex" alignItems="center" gap={2}>
        <FormControl size="small">
          <InputLabel>Range</InputLabel>
          <Select
            value={filter}
            label="Range"
            onChange={(e) => setFilter(e.target.value)}
          >
            {statFilters.map((f) => (
              <MenuItem key={f.value} value={f.value}>
                {f.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={4}>
          <StatCard title="Total" value={stats.total} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard title="Resolved" value={stats.resolved} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard title="Pending" value={stats.pending} />
        </Grid>
      </Grid>
      <DashboardCharts topTypes={topTypes} stats={stats} />
      <Box mt={4}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="h6" mb={2} fontWeight={500}>
            Recent Complaints
          </Typography>
          <ComplaintTable
            complaints={complaints}
            page={page}
            rowsPerPage={rowsPerPage}
            total={totalComplaints}
            loading={loading}
            onPageChange={setPage}
            onRowsPerPageChange={(e) => setRowsPerPage(Number(e.target.value))}
            onRowClick={setSelectedComplaint}
            rowsPerPageOptions={[5, 10, 20]}
          />
        </Paper>
      </Box>
      <AdminComplaintModal
        complaint={selectedComplaint}
        open={!!selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
      />
    </Box>
  );
};

export default Dashboard;
