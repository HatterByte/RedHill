import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  CircularProgress,
} from "@mui/material";
import api from "../utils/api";
import { useGlobalAlert } from "../../utils/AlertContext";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LOGIN_SUCCESS } from "../../utils/types";

const AdminLoginModal = ({ open, onClose, onSuccess }) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { showAlert } = useGlobalAlert();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login-password", { phone, password });
      showAlert("Login successful!", "success");
      setPhone("");
      setPassword("");
      dispatch({ type: LOGIN_SUCCESS, payload: { user: res.data.user } });
      onSuccess?.(res.data.user);
      onClose();
      navigate("/admin");
    } catch (err) {
      showAlert(err?.response?.data?.message || "Login failed!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Admin Login</DialogTitle>
      <form onSubmit={handleLogin}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Phone"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              inputProps={{ maxLength: 10 }}
              required
              autoFocus
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onClose}
            disabled={loading}
            variant="outlined"
            sx={{
              color: "#fff",
              backgroundColor: "#75002b",
              borderColor: "#75002b",
              "&:hover": {
                backgroundColor: "#4b001a",
                borderColor: "#4b001a",
                color: "#fff",
              },
              minWidth: 100,
              boxShadow: 2,
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: "#75002b",
              color: "#fff",
              "&:hover": { backgroundColor: "#4b001a", color: "#fff" },
              minWidth: 100,
              boxShadow: 2,
            }}
          >
            {loading ? (
              <CircularProgress size={22} sx={{ color: "#fff" }} />
            ) : (
              "Login"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AdminLoginModal;
