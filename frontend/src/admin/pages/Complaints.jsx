import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import ComplaintTable from "../components/ComplaintTable";

// Dummy data
const dummyComplaints = Array.from({ length: 20 }, (_, i) => ({
  _id: `CMP${1000 + i}`,
  type: "Service",
  subtype: "Delay",
  severity: "High",
  resolved: i % 2 === 0,
  createdAt: new Date().toISOString(),
}));

const Complaints = () => {
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        All Complaints
      </Typography>
      {/* Filters can be added here */}
      <ComplaintTable
        complaints={dummyComplaints.slice(
          page * rowsPerPage,
          (page + 1) * rowsPerPage
        )}
        page={page}
        rowsPerPage={rowsPerPage}
        total={dummyComplaints.length}
        onPageChange={setPage}
        onRowClick={(row) => alert(`Open details for ${row._id}`)}
      />
    </Box>
  );
};

export default Complaints;
