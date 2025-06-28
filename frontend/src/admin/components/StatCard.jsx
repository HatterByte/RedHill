import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const StatCard = ({ title, value, icon }) => (
  <Card sx={{ minWidth: 180, display: "flex", alignItems: "center", p: 2 }}>
    {icon && <span style={{ marginRight: 16 }}>{icon}</span>}
    <CardContent sx={{ flex: 1 }}>
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h5" fontWeight={600}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

export default StatCard;
