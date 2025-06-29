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
import Heatmap from "../components/Heatmap";

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
  // Dashboard stats complaints (filtered)
  const [dashboardComplaints, setDashboardComplaints] = React.useState([]);
  // Recent complaints (all, paginated)
  const [recentComplaints, setRecentComplaints] = React.useState([]);
  const [recentTotal, setRecentTotal] = React.useState(0);
  const [recentPage, setRecentPage] = React.useState(0);
  const [recentRowsPerPage, setRecentRowsPerPage] = React.useState(5);
  const [recentLoading, setRecentLoading] = React.useState(false);
  const [selectedComplaint, setSelectedComplaint] = React.useState(null);
  // Add states for total complaints for today, week, month
  const [totals, setTotals] = React.useState({ today: 0, week: 0, month: 0 });

  // Fetch dashboard stats and top types (filtered)
  React.useEffect(() => {
    // Get all complaints for filter
    const fetchStats = async () => {
      try {
        const params = {};
        if (filter !== "all") params.dateRange = filter;
        const res = await api.get(`/complaints`, { params });
        const data = res.data.complaints;
        // Calculate resolved/pending
        let resolved = 0,
          pending = 0;
        data.forEach((c) => (c.resolved ? resolved++ : pending++));
        setStats({ total: res.data.total, resolved, pending });
        setDashboardComplaints(data);
      } catch (e) {
        setStats({ total: 0, resolved: 0, pending: 0 });
        setDashboardComplaints([]);
      }
    };
    const fetchTopTypes = async () => {
      try {
        const params = { limit: 5, dateRange: filter };
        const res = await api.get(`/complaints-stats/top-types`, {
          params,
        });
        setTopTypes(res.data.topTypes || []);
      } catch (e) {
        setTopTypes([]);
      }
    };
    fetchStats();
    fetchTopTypes();
  }, [filter]);

  // Fetch recent complaints (all, paginated)
  React.useEffect(() => {
    setRecentLoading(true);
    const fetchRecent = async () => {
      try {
        const params = { page: recentPage + 1, limit: recentRowsPerPage };
        const res = await api.get(`/complaints`, { params });
        setRecentComplaints(res.data.complaints);
        setRecentTotal(res.data.total);
      } catch (e) {
        setRecentComplaints([]);
        setRecentTotal(0);
      }
      setRecentLoading(false);
    };
    fetchRecent();
  }, [recentPage, recentRowsPerPage]);

  // Reset recent page to 0 when rowsPerPage changes
  React.useEffect(() => {
    setRecentPage(0);
  }, [recentRowsPerPage]);

  // Fetch total complaints for today, week, month on mount
  React.useEffect(() => {
    const fetchTotals = async () => {
      try {
        const [todayRes, weekRes, monthRes] = await Promise.all([
          api.get("/complaints", { params: { dateRange: "daily" } }),
          api.get("/complaints", { params: { dateRange: "weekly" } }),
          api.get("/complaints", { params: { dateRange: "monthly" } }),
        ]);
        setTotals({
          today: todayRes.data.total || 0,
          week: weekRes.data.total || 0,
          month: monthRes.data.total || 0,
        });
      } catch (e) {
        setTotals({ today: 0, week: 0, month: 0 });
      }
    };
    fetchTotals();
  }, []);

  return (
    <Box p={2}>
      <Box width="90%">
        <Typography variant="h5" mb={2} fontWeight={600}>
          Admin Dashboard
        </Typography>
        <Paper elevation={2} sx={{ p: 1, mb: 3, width: "69%" }}>
          <Typography variant="h6" mb={2} fontWeight={500}>
            Complaint Stats
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={4}>
              <StatCard title="Total Today" value={totals.today} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard title="Total This Week" value={totals.week} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard title="Total This Month" value={totals.month} />
            </Grid>
          </Grid>
        </Paper>
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
        <Box>
          <DashboardCharts topTypes={topTypes} stats={stats} />
          <Box mt={3}>
            <Heatmap />
          </Box>
        </Box>
        <Box mt={4}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" mb={2} fontWeight={500}>
              Recent Complaints
            </Typography>
            <ComplaintTable
              complaints={recentComplaints}
              page={recentPage}
              rowsPerPage={recentRowsPerPage}
              total={recentTotal}
              loading={recentLoading}
              onPageChange={setRecentPage}
              onRowsPerPageChange={(e) =>
                setRecentRowsPerPage(Number(e.target.value))
              }
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
    </Box>
  );
};

export default Dashboard;
