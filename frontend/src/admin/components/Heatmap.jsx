import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  useTheme,
} from "@mui/material";
import CalHeatmap from "cal-heatmap";
import Tooltip from "cal-heatmap/plugins/Tooltip";
import LegendLite from "cal-heatmap/plugins/LegendLite";
import CalendarLabel from "cal-heatmap/plugins/CalendarLabel";
import "cal-heatmap/cal-heatmap.css";
import api from "../../admin/utils/api";

const Heatmap = () => {
  const [loading, setLoading] = useState(true);
  const calRef = useRef(null);
  const heatmapRef = useRef(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await api.get("/complaints/heatmap");
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && calRef.current) {
      // Initialize cal-heatmap
      const cal = new CalHeatmap();
      heatmapRef.current = cal;

      // Color ranges
      const darkRange = [
        "#18181b", // for 0 value (very dark, neutral)
        "#ABAAC3",
        "#7D7C9E",
        "#5F5E79",
        "#3D3B4F",
      ];
      const maroonRange = [
        "#fbe9ee", // for 0 value (very light pink)
        "#f5b6c6",
        "#e57399",
        "#c2185b",
        "#75002b",
      ];
      const colorRange = isDark ? darkRange : maroonRange;

      cal.paint(
        {
          itemSelector: "#ex-ghDay",
          domain: {
            type: "month",
            gutter: 4,
            label: { text: "MMM", textAlign: "start", position: "top" },
          },
          subDomain: {
            type: "ghDay",
            radius: 2,
            width: 11,
            height: 11,
            gutter: 4,
          },
          range: 12,
          data: {
            source: `${
              import.meta.env.VITE_BASE_URL
            }/admin/complaints/heatmap?start={{start=YYYY-MM-DD}}&end={{end=YYYY-MM-DD}}`,
            type: "json",
            requestInit: {
              credentials: "include",
              // headers: { ... } // add custom headers if needed
            },
            x: "date",
            y: "value",
            defaultValue: 0,
          },
          scale: {
            color: {
              type: "threshold",
              range: colorRange,
              domain: [1, 3, 6, 10],
            },
          },
        },
        [
          [
            Tooltip,
            {
              text: (date, value, dayjsDate) =>
                (value ? value : "No") +
                " complaints on " +
                dayjsDate.format("dddd, MMMM D, YYYY"),
            },
          ],
          [
            LegendLite,
            {
              includeBlank: true,
              itemSelector: "#ex-ghDay-legend",
              radius: 2,
              width: 11,
              height: 11,
              gutter: 4,
            },
          ],
          [
            CalendarLabel,
            {
              width: 30,
              textAlign: "start",
              text: () =>
                window.dayjs
                  .weekdaysShort()
                  .map((d, i) => (i % 2 === 0 ? "" : d)),
              padding: [25, 0, 0, 0],
            },
          ],
        ]
      );
    }

    // Cleanup
    return () => {
      if (heatmapRef.current) {
        try {
          heatmapRef.current.destroy();
        } catch (e) {}
      }
    };
  }, [loading, theme.palette.mode]);

  // Navigation handlers
  const handlePrev = () => heatmapRef.current && heatmapRef.current.previous();
  const handleNext = () => heatmapRef.current && heatmapRef.current.next();

  return (
    <Card sx={{ minWidth: 900, p: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Complaints Heatmap
        </Typography>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <Box>
            <div id="ex-ghDay" ref={calRef} style={{ minHeight: "150px" }} />
            <Box mt={2} display="flex" alignItems="center">
              <Button size="small" variant="outlined" onClick={handlePrev}>
                ← Previous
              </Button>
              <Button
                size="small"
                variant="outlined"
                sx={{ ml: 1 }}
                onClick={handleNext}
              >
                Next →
              </Button>
              <Box flex={1} />
              <span style={{ color: "#768390", fontSize: 12 }}>Less</span>
              <div
                id="ex-ghDay-legend"
                style={{ display: "inline-block", margin: "0 4px" }}
              ></div>
              <span style={{ color: "#768390", fontSize: 12 }}>More</span>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default Heatmap;

/*
In your backend controller, change:
res.status(200).json({ days });
to:
res.status(200).json(days);

And change:
days.push({ date: dateStr, count: dayMap[dateStr] || 0 });
to:
days.push({ date: dateStr, value: dayMap[dateStr] || 0 });

This will make your backend response compatible with cal-heatmap's remote loading.
*/
