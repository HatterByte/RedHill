import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Chip,
} from "@mui/material";

const ComplaintTable = ({
  complaints,
  page,
  rowsPerPage,
  total,
  onPageChange,
  onRowsPerPageChange,
  onRowClick,
  rowsPerPageOptions = [5, 10, 20],
}) => (
  <Paper sx={{ width: "100%", overflow: "hidden" }}>
    <TableContainer>
      <Table stickyHeader>
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
              hover
              key={row._id}
              onClick={() => onRowClick(row)}
              style={{ cursor: "pointer" }}
            >
              <TableCell>{row._id}</TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell>{row.subtype}</TableCell>
              <TableCell>{row.severity}</TableCell>
              <TableCell>
                <Chip
                  label={row.resolved ? "Resolved" : "Pending"}
                  color={row.resolved ? "success" : "warning"}
                  size="small"
                />
              </TableCell>
              <TableCell>{new Date(row.createdAt).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
      component="div"
      count={total}
      page={page}
      onPageChange={(_, newPage) => onPageChange(newPage)}
      rowsPerPage={rowsPerPage}
      rowsPerPageOptions={rowsPerPageOptions}
      onRowsPerPageChange={onRowsPerPageChange}
    />
  </Paper>
);

export default ComplaintTable;
