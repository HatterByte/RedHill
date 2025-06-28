import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
} from "@mui/material";

// Dummy ML output
const mlResults = [
  {
    id: "CMP1001",
    image: "https://via.placeholder.com/100",
    predicted: "Garbage",
    manual: null,
  },
  {
    id: "CMP1002",
    image: "https://via.placeholder.com/100",
    predicted: "Clean",
    manual: "Clean",
  },
];

const ClassificationMonitor = () => (
  <Box p={3}>
    <Typography variant="h5" mb={2}>
      Classification Monitor
    </Typography>
    <Stack spacing={2}>
      {mlResults.map((res) => (
        <Card key={res.id}>
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <img
              src={res.image}
              alt={res.id}
              width={80}
              height={80}
              style={{ borderRadius: 8 }}
            />
            <Box flex={1}>
              <Typography>ID: {res.id}</Typography>
              <Typography>Predicted: {res.predicted}</Typography>
              <Typography>Manual: {res.manual || "-"}</Typography>
            </Box>
            <Button variant="contained" color="primary" size="small">
              Override
            </Button>
          </CardContent>
        </Card>
      ))}
    </Stack>
  </Box>
);

export default ClassificationMonitor;
