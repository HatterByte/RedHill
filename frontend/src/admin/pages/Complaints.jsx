import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import ComplaintTable from "../components/ComplaintTable";
import api from "../utils/api";
import categoryData from "../../assets/categoryData.json";
import AdminComplaintModal from "../components/AdminComplaintModal";

const Complaints = () => {
  // Filter states
  const [type, setType] = useState("");
  const [subtype, setSubtype] = useState("");
  const [resolved, setResolved] = useState("");
  const [train, setTrain] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [trains, setTrains] = useState([]);

  // Table states
  const [complaints, setComplaints] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Types and subtypes from categoryData
  const types = Object.keys(categoryData);
  const subtypes = type ? categoryData[type] : [];

  // Fetch train list (placeholder, replace with API if needed)
  useEffect(() => {
    setTrains(["12345", "54321", "67890"]);
  }, []);

  // Fetch complaints when filters, page, or rowsPerPage change
  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      try {
        const params = {
          page: page + 1, // backend expects 1-based
          limit: rowsPerPage,
        };
        if (type) params.type = type;
        if (subtype) params.subtype = subtype;
        if (resolved !== "") params.resolved = resolved;
        if (train) params.train = train;
        if (dateRange) params.dateRange = dateRange;
        const res = await api.get("/complaints", { params });
        setComplaints(res.data.complaints);
        setTotal(res.data.total);
      } catch (err) {
        setComplaints([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
    // eslint-disable-next-line
  }, [type, subtype, resolved, train, dateRange, page, rowsPerPage]);

  // Reset page to 0 when filters or rowsPerPage change
  useEffect(() => {
    setPage(0);
  }, [type, subtype, resolved, train, dateRange, rowsPerPage]);

  // Handlers
  const handleTypeChange = (e) => {
    setType(e.target.value);
    setSubtype("");
  };
  const handleSubtypeChange = (e) => setSubtype(e.target.value);
  const handleResolvedChange = (e) => setResolved(e.target.value);
  const handleTrainChange = (e) => setTrain(e.target.value);
  const handleDateRangeChange = (e) => setDateRange(e.target.value);
  const handleRowsPerPageChange = (e) => setRowsPerPage(Number(e.target.value));
  const handleClear = () => {
    setType("");
    setSubtype("");
    setResolved("");
    setTrain("");
    setDateRange("");
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        All Complaints
      </Typography>
      <Box mb={2}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={2.4} md={2.4} lg={2.4} xl={2.4}>
            <FormControl fullWidth size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Type</InputLabel>
              <Select value={type} label="Type" onChange={handleTypeChange}>
                <MenuItem value="">All</MenuItem>
                {types.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2.4} md={2.4} lg={2.4} xl={2.4}>
            <FormControl fullWidth size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Subtype</InputLabel>
              <Select
                value={subtype}
                label="Subtype"
                onChange={handleSubtypeChange}
                disabled={!type}
              >
                <MenuItem value="">All</MenuItem>
                {subtypes.map((st) => (
                  <MenuItem key={st} value={st}>
                    {st}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2.1} md={2.1} lg={2.1} xl={2.1}>
            <FormControl fullWidth size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Resolved</InputLabel>
              <Select
                value={resolved}
                label="Resolved"
                onChange={handleResolvedChange}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="true">Resolved</MenuItem>
                <MenuItem value="false">Unresolved</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2.1} md={2.1} lg={2.1} xl={2.1}>
            <FormControl fullWidth size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Train</InputLabel>
              <Select value={train} label="Train" onChange={handleTrainChange}>
                <MenuItem value="">All</MenuItem>
                {trains.map((tr) => (
                  <MenuItem key={tr} value={tr}>
                    {tr}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2.1} md={2.1} lg={2.1} xl={2.1}>
            <FormControl fullWidth size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Date Range</InputLabel>
              <Select
                value={dateRange}
                label="Date Range"
                onChange={handleDateRangeChange}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="daily">Today</MenuItem>
                <MenuItem value="weekly">This Week</MenuItem>
                <MenuItem value="monthly">This Month</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={1.5} md={1.5} lg={1.5} xl={1.5}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleClear}
              fullWidth
              sx={{ minWidth: 120 }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Box>
      <ComplaintTable
        complaints={complaints}
        page={page}
        rowsPerPage={rowsPerPage}
        total={total}
        loading={loading}
        onPageChange={setPage}
        onRowsPerPageChange={(e) => setRowsPerPage(Number(e.target.value))}
        onRowClick={setSelectedComplaint}
        rowsPerPageOptions={[5, 10, 20]}
      />
      <AdminComplaintModal
        complaint={selectedComplaint}
        open={!!selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
      />
    </Box>
  );
};

export default Complaints;
