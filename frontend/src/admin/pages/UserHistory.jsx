import React from "react";
import { Box, Typography, Card, CardContent, Stack } from "@mui/material";

// Dummy grouped data
const userComplaints = [
  { phone: "9876543210", complaints: ["CMP1001", "CMP1002"] },
  { phone: "9123456789", complaints: ["CMP1003"] },
];

const UserHistory = () => (
  <Box p={3}>
    <Typography variant="h5" mb={2}>
      User Complaint History
    </Typography>
    <Stack spacing={2}>
      {userComplaints.map((user) => (
        <Card key={user.phone}>
          <CardContent>
            <Typography fontWeight={600}>Phone: {user.phone}</Typography>
            <Typography>Complaints: {user.complaints.join(", ")}</Typography>
          </CardContent>
        </Card>
      ))}
    </Stack>
  </Box>
);

export default UserHistory;
