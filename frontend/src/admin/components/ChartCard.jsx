import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const ChartCard = ({ title, children }) => (
  <Card sx={{ minWidth: 300, p: 2 }}>
    <CardContent>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        {title}
      </Typography>
      {children}
    </CardContent>
  </Card>
);

export default ChartCard;
