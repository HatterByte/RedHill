import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

// Dummy data for heatmap
const dummyData = [
  [1, 2, 3, 4, 5, 6, 7],
  [2, 3, 4, 5, 6, 7, 8],
  [3, 4, 5, 6, 7, 8, 9],
  [4, 5, 6, 7, 8, 9, 10],
];

const getColor = (value) => {
  const colors = [
    "#e0f7fa",
    "#b2ebf2",
    "#80deea",
    "#4dd0e1",
    "#26c6da",
    "#00bcd4",
    "#0097a7",
    "#006064",
    "#004d40",
    "#00251a",
  ];
  return colors[Math.min(value, colors.length - 1)];
};

const Heatmap = () => (
  <Card sx={{ minWidth: 300, p: 2 }}>
    <CardContent>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Complaints Heatmap (Dummy)
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${dummyData[0].length}, 32px)`,
          gap: 1,
        }}
      >
        {dummyData.flat().map((val, idx) => (
          <Box
            key={idx}
            sx={{
              width: 32,
              height: 32,
              background: getColor(val),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 1,
              fontWeight: 500,
            }}
          >
            {val}
          </Box>
        ))}
      </Box>
    </CardContent>
  </Card>
);

export default Heatmap;
