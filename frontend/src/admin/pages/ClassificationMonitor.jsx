import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
} from "@mui/material";
import api from "../utils/api";
import categoryData from "../../assets/categoryData.json";

const EditModal = ({ open, onClose, complaint, onSave }) => {
  // Defensive: don't render modal if complaint is null or undefined
  if (!complaint) return null;
  const [type, setType] = useState(complaint.type || "");
  const [subtype, setSubtype] = useState(complaint.subtype || "");
  const [severity, setSeverity] = useState(complaint.severity || "");
  useEffect(() => {
    setType(complaint.type || "");
    setSubtype(complaint.subtype || "");
    setSeverity(complaint.severity || "");
  }, [complaint]);
  const subtypes = type ? categoryData[type] : [];
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Edit Classification</DialogTitle>
      <DialogContent dividers>
        <FormControl fullWidth margin="normal" size="small">
          <InputLabel>Type</InputLabel>
          <Select
            value={type}
            label="Type"
            onChange={(e) => {
              setType(e.target.value);
              setSubtype("");
            }}
          >
            {Object.keys(categoryData).map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal" size="small" disabled={!type}>
          <InputLabel>Subtype</InputLabel>
          <Select
            value={subtype}
            label="Subtype"
            onChange={(e) => setSubtype(e.target.value)}
          >
            {subtypes.map((st) => (
              <MenuItem key={st} value={st}>
                {st}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal" size="small">
          <InputLabel>Severity</InputLabel>
          <Select
            value={severity}
            label="Severity"
            onChange={(e) => setSeverity(e.target.value)}
          >
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => onSave({ type, subtype, severity })}
          disabled={!type || !subtype || !severity}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const VideoModal = ({ open, onClose, src }) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle>View Video</DialogTitle>
    <DialogContent
      dividers
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 300,
      }}
    >
      <video
        src={src}
        controls
        autoPlay
        style={{
          maxWidth: "100%",
          maxHeight: 500,
          borderRadius: 8,
        }}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Close</Button>
    </DialogActions>
  </Dialog>
);

const ClassificationMonitor = () => {
  const [mlResults, setMlResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [editComplaint, setEditComplaint] = useState(null);
  const [videoModal, setVideoModal] = useState({ open: false, src: null });

  useEffect(() => {
    const fetchMLResults = async () => {
      setLoading(true);
      try {
        const res = await api.get("/complaints/mlresult", {
          params: { page: page + 1, limit: rowsPerPage },
        });
        setMlResults(res.data.complaints);
        setTotal(res.data.total);
      } catch (e) {
        setMlResults([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };
    fetchMLResults();
  }, [page, rowsPerPage]);

  const handleSave = async (fields) => {
    if (!editComplaint) return;
    try {
      await api.patch(`/complaints/${editComplaint.referenceNo}`, fields);
      setEditComplaint(null);
      // Refresh data
      const res = await api.get("/complaints/mlresult", {
        params: { page: page + 1, limit: rowsPerPage },
      });
      setMlResults(res.data.complaints);
      setTotal(res.data.total);
    } catch (e) {
      // handle error
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Classification Monitor
      </Typography>
      <Stack spacing={2}>
        {mlResults.map((res) => (
          <Card key={res.referenceNo}>
            <CardContent
              sx={{
                display: "flex",
                alignItems: "stretch",
                gap: 2,
              }}
            >
              <Box
                flex={1}
                display="flex"
                flexDirection="column"
                justifyContent="center"
                gap={1}
              >
                <Typography fontWeight={600}>Ref: {res.referenceNo}</Typography>
                <Typography>Type: {res.type || "-"}</Typography>
                <Typography>Subtype: {res.subtype || "-"}</Typography>
                <Typography>Severity: {res.severity || "-"}</Typography>
              </Box>
              <Box
                display="flex"
                gap={1}
                alignItems="center"
                flexDirection="row-reverse"
              >
                {res.images && res.images.length > 0 ? (
                  res.images.map((mediaUrl, idx) => {
                    const isVideo = /\.(mp4|webm|ogg)$/i.test(mediaUrl);
                    return isVideo ? (
                      <Button
                        key={idx}
                        variant="outlined"
                        size="small"
                        sx={{
                          minWidth: 80,
                          height: 80,
                          borderRadius: 2,
                          p: 0,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onClick={() => setVideoModal({ open: true, src: mediaUrl })}
                      >
                        <Box sx={{ fontSize: 32, mb: 0.5 }}>🎬</Box>
                        <Typography variant="caption">View Video</Typography>
                      </Button>
                    ) : (
                      <img
                        key={idx}
                        src={mediaUrl}
                        alt={`media-${idx}`}
                        width={80}
                        height={80}
                        style={{ borderRadius: 8, objectFit: "cover" }}
                      />
                    );
                  })
                ) : (
                  <Box width={80} height={80} bgcolor="#eee" borderRadius={2} />
                )}
              </Box>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => setEditComplaint(res)}
              >
                Override
              </Button>
            </CardContent>
          </Card>
        ))}
        {mlResults.length === 0 && !loading && (
          <Typography color="text.secondary">No results found.</Typography>
        )}
      </Stack>
      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(Number(e.target.value));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 20]}
      />
      <EditModal
        open={!!editComplaint}
        onClose={() => setEditComplaint(null)}
        complaint={editComplaint}
        onSave={handleSave}
      />
      <VideoModal
        open={videoModal.open}
        onClose={() => setVideoModal({ open: false, src: null })}
        src={videoModal.src}
      />
    </Box>
  );
};

export default ClassificationMonitor;
