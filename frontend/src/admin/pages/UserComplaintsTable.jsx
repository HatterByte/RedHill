import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import AdminComplaintModal from "../components/AdminComplaintModal";

const UserComplaintsTable = () => {
  const { phone } = useParams();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      try {
        const res = await api.get("/complaints", { params: { phone } });
        setComplaints(res.data.complaints);
      } catch (e) {
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, [phone]);

  const handleRowClick = (complaint) => {
    setSelectedComplaint(complaint);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedComplaint(null);
  };

  return (
    <Box p={3}>
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton onClick={() => navigate(-1)} size="small" sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6">Complaints for {phone}</Typography>
      </Box>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Subtype</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {complaints.map((row) => (
                <TableRow
                  key={row._id}
                  hover
                  style={{ cursor: "pointer" }}
                  onClick={() => handleRowClick(row)}
                >
                  <TableCell>{row._id}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.subtype}</TableCell>
                  <TableCell>{row.severity}</TableCell>
                  <TableCell>{row.resolved ? "Resolved" : "Pending"}</TableCell>
                  <TableCell>
                    {new Date(row.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
              {complaints.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No complaints found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <AdminComplaintModal
        complaint={selectedComplaint}
        open={modalOpen}
        onClose={handleCloseModal}
      />
    </Box>
  );
};

export default UserComplaintsTable;
