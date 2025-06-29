import React, { useState } from "react";
import { Box, Grid, TextField, Typography, useTheme } from "@mui/material";
import ChartCard from "./ChartCard";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

const days = ["S", "M", "T", "W", "T", "F", "S"];

// Generate a 7x12 grid (7 days x 12 weeks)
const getHeatmapData = (trainNo) => {
  if (!trainNo) return [];
  // 12 weeks, 7 days each
  return Array.from({ length: 12 }, () =>
    Array.from({ length: 7 }, () => Math.floor(Math.random() * 10))
  );
};

const DashboardCharts = ({ topTypes = [], stats = {} }) => {
  const [trainNo, setTrainNo] = useState("");
  const heatmap = getHeatmapData(trainNo);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  // Pie chart: use stats if available
  const pieData =
    stats &&
    typeof stats.resolved === "number" &&
    typeof stats.pending === "number"
      ? [
          { name: "Pending", value: stats.pending },
          { name: "Resolved", value: stats.resolved },
        ]
      : [
          { name: "Pending", value: 120 },
          { name: "Resolved", value: 380 },
        ];
  // Bar chart: use topTypes if available
  const barData =
    Array.isArray(topTypes) && topTypes.length > 0
      ? topTypes.map((t) => ({ type: t.type, count: t.count }))
      : [
          { type: "Cleanliness", count: 180 },
          { type: "Security", count: 90 },
          { type: "Delay", count: 60 },
          { type: "Other", count: 50 },
        ];
  // Chart colors
  const PIE_COLORS = isDark
    ? ["#e0e0e0", "#5F5E79"] // light gray, maroon in dark mode
    : [theme.palette.secondary.main, "#75002b"]; // yellow, maroon in light mode
  const BAR_COLOR = isDark
    ? "#5F5E79" // light gray in dark mode
    : "#75002b"; // maroon in light mode
  const AXIS_COLOR = isDark ? theme.palette.grey[400] : theme.palette.grey[700];
  const GRID_COLOR = isDark ? theme.palette.grey[800] : theme.palette.grey[300];
  const HEATMAP_COLORS = [
    isDark ? "#23232a" : "#e0e0e0",
    isDark ? "#4dd0e1" : theme.palette.secondary.light,
    isDark ? "#00bcd4" : theme.palette.secondary.main,
    isDark ? "#f06292" : theme.palette.primary.light,
    isDark ? "#f9c846" : theme.palette.primary.main,
    isDark ? "#fff" : theme.palette.primary.dark,
    "#a31545",
    "#75002b",
    "#3d0016",
    "#1a0010",
  ];
  const getColor = (value) =>
    HEATMAP_COLORS[Math.min(value, HEATMAP_COLORS.length - 1)];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <ChartCard title="Status: Pending vs Resolved">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {pieData.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={PIE_COLORS[idx % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <ReTooltip
                contentStyle={{
                  background: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  border: "none",
                }}
              />
              <Legend wrapperStyle={{ color: theme.palette.text.primary }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </Grid>
      <Grid item xs={12} md={4}>
        <ChartCard title="Top Complaint Types">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={barData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
              <XAxis
                dataKey="type"
                stroke={AXIS_COLOR}
                tick={{ fill: AXIS_COLOR }}
              />
              <YAxis stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR }} />
              <Bar dataKey="count" fill={BAR_COLOR} />
              <ReTooltip
                contentStyle={{
                  background: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  border: "none",
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </Grid>
    </Grid>
  );
};

export default DashboardCharts;
