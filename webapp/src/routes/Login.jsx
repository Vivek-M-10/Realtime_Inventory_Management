import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper
} from "@mui/material";
import axios from "axios";

const BASE_URL = "http://localhost:8002/";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Login API
      const response = await axios.post(`${BASE_URL}login`, {
        username,
        password
      });
console.log('response',response);

      // Assuming backend returns { role: "Admin" | "User", token: "..." }
      if (response.data) {
  const { role, access_token } = response.data;

  localStorage.setItem("token", access_token);
  localStorage.setItem("role", role);

  if (role === "User") {
    navigate("/create-order");
  } else if (role === "Admin") {
    navigate("/");
  }
}
else {
        alert("Invalid login response from server.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid username or password");
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 6,
        p: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Login
      </Typography>

      <Box component="form" onSubmit={handleLogin}>
        <TextField
          fullWidth
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Login
        </Button>
      </Box>
    </Paper>
  );
};
