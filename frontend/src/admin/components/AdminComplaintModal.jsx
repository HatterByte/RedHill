import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Chip,
  Box,
} from "@mui/material";

const AdminComplaintModal = ({ complaint, open, onClose }) => {
  if (!complaint) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Complaint Details</DialogTitle>
      <DialogContent dividers>
        <Box mb={2}>
          <Typography variant="subtitle2" color="text.secondary">
            Reference ID:
          </Typography>
          <Typography variant="body1" fontWeight={600}>
            {complaint._id}
          </Typography>
        </Box>
        <Box
          mb={2}
          display="grid"
          gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
          gap={2}
        >
          <Box>
            <Typography variant="caption">Name</Typography>
            <Typography>{complaint.name || "N/A"}</Typography>
          </Box>
          <Box>
            <Typography variant="caption">Phone</Typography>
            <Typography>{complaint.phone || "N/A"}</Typography>
          </Box>
          <Box>
            <Typography variant="caption">Train Number</Typography>
            <Typography>{complaint.trainCode || "N/A"}</Typography>
          </Box>
          <Box>
            <Typography variant="caption">Train Name</Typography>
            <Typography>{complaint.trainName || "N/A"}</Typography>
          </Box>
          <Box>
            <Typography variant="caption">Category</Typography>
            <Typography>{complaint.type || "N/A"}</Typography>
          </Box>
          <Box>
            <Typography variant="caption">Sub-Category</Typography>
            <Typography>{complaint.subtype || "N/A"}</Typography>
          </Box>
        </Box>
        <Box mb={2}>
          <Typography variant="caption">Description</Typography>
          <Typography
            sx={{ bgcolor: "background.paper", p: 1, borderRadius: 1, mt: 0.5 }}
          >
            {complaint.description || "No description provided"}
          </Typography>
        </Box>
        {complaint.media && complaint.media.length > 0 && (
          <Box mb={2}>
            <Typography variant="caption">
              Attached Media ({complaint.media.length})
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={2} mt={1}>
              {complaint.media.map((mediaUrl, idx) => {
                const isVideo = /\.(mp4|webm|ogg)$/i.test(mediaUrl);
                return isVideo ? (
                  <Button
                    key={idx}
                    variant="outlined"
                    size="small"
                    sx={{
                      minWidth: 120,
                      height: 120,
                      borderRadius: 2,
                      p: 0,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onClick={() => window.open(mediaUrl, "_blank")}
                  >
                    <Box sx={{ fontSize: 32, mb: 0.5 }}>🎬</Box>
                    <Typography variant="caption">View Video</Typography>
                  </Button>
                ) : (
                  <a
                    href={mediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={idx}
                    style={{ display: "block" }}
                  >
                    <img
                      src={mediaUrl}
                      alt={`Attachment ${idx + 1}`}
                      style={{
                        maxHeight: 120,
                        borderRadius: 8,
                        background: "#fff",
                        boxShadow: "0 1px 4px #0001",
                      }}
                    />
                  </a>
                );
              })}
            </Box>
          </Box>
        )}
        <Box mb={2}>
          <Typography variant="caption">Status</Typography>
          <Chip
            label={complaint.resolved ? "Resolved" : "Pending"}
            color={complaint.resolved ? "success" : "warning"}
            size="small"
            sx={{ ml: 1 }}
          />
        </Box>
        {complaint.otp && (
          <Box mb={2}>
            <Typography variant="caption">Verification OTP</Typography>
            <Typography fontWeight={600} color="primary">
              {complaint.otp}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminComplaintModal;
