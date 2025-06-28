import React from "react";
import { Box, Typography, Card, CardMedia, Chip, Stack } from "@mui/material";

// Dummy complaint
const complaint = {
  _id: "CMP1001",
  type: "Service",
  subtype: "Delay",
  severity: "High",
  resolved: false,
  createdAt: new Date().toISOString(),
  media: ["https://via.placeholder.com/150"],
  classification: "Garbage",
};

const ComplaintDetails = () => (
  <Box p={3}>
    <Typography variant="h5" mb={2}>
      Complaint Details
    </Typography>
    <Stack spacing={2}>
      <Card>
        <CardMedia
          component="img"
          height="200"
          image={complaint.media[0]}
          alt="Complaint Media"
        />
      </Card>
      <Typography>ID: {complaint._id}</Typography>
      <Typography>Type: {complaint.type}</Typography>
      <Typography>Subtype: {complaint.subtype}</Typography>
      <Typography>Severity: {complaint.severity}</Typography>
      <Typography>
        Status:{" "}
        <Chip
          label={complaint.resolved ? "Resolved" : "Pending"}
          color={complaint.resolved ? "success" : "warning"}
          size="small"
        />
      </Typography>
      <Typography>
        Classification:{" "}
        <Chip label={complaint.classification} color="info" size="small" />
      </Typography>
      <Typography>
        Date: {new Date(complaint.createdAt).toLocaleString()}
      </Typography>
    </Stack>
  </Box>
);

export default ComplaintDetails;
