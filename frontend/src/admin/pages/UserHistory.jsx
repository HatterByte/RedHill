import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  TablePagination,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const UserHistory = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchPhone, setSearchPhone] = useState("");

  // Debounced search function
  const debouncedFetch = useCallback(
    (() => {
      let timeoutId;
      return (phone) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setPage(0); // Reset to first page on search
          fetchUsers(0, rowsPerPage, phone);
        }, 500);
      };
    })(),
    [rowsPerPage]
  );

  const fetchUsers = async (currentPage, limit, phone = searchPhone) => {
    setLoading(true);
    try {
      const res = await api.get("/complaints/complaints-summary", {
        params: {
          page: currentPage + 1,
          limit,
          phone: phone.trim() || undefined,
        },
      });
      setUsers(res.data.users);
      setTotal(res.data.total);
    } catch (e) {
      setUsers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchPhone(value);
    debouncedFetch(value);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        User Complaint History
      </Typography>

      {/* Search Box */}
      <Box mb={3}>
        <TextField
          fullWidth
          placeholder="Search by phone number..."
          value={searchPhone}
          onChange={handleSearch}
          variant="outlined"
          size="small"
          sx={{ maxWidth: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Stack spacing={2}>
        {users.map((user) => (
          <Card key={user.phone}>
            <CardContent
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography fontWeight={600}>Phone: {user.phone}</Typography>
                <Typography
                  sx={{
                    maxWidth: 800,
                    display: "block",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  <span style={{ display: "inline-block" }}>
                    Complaints:{" "}
                    {(() => {
                      if (!Array.isArray(user.complaints))
                        return String(user.complaints);
                      const displayComplaints = user.complaints.slice(0, 5);
                      return `${displayComplaints.join(", ")}${
                        user.complaints.length > 3 ? "..." : ""
                      }`;
                    })()}
                  </span>
                </Typography>
                <Typography variant="caption">Total: {user.count}</Typography>
              </Box>
              <Button
                variant="outlined"
                size="small"
                sx={{ whiteSpace: "nowrap", minWidth: 120, flexShrink: 0 }}
                onClick={() => navigate(`/admin/user-history/${user.phone}`)}
              >
                View Complaints
              </Button>
            </CardContent>
          </Card>
        ))}
        {users.length === 0 && !loading && (
          <Typography color="text.secondary">No users found.</Typography>
        )}
      </Stack>
      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(Number(e.target.value));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 20]}
      />
    </Box>
  );
};

export default UserHistory;
