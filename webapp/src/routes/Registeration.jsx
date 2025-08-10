import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  MenuItem,
  Select,
  TextField,
  Typography,
  InputLabel,
  FormControl,
} from "@mui/material";
import axios from "axios";
import Headers from "./Header"
import { useNavigate } from "react-router-dom";


const Registration = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
const BASE_URL = "http://localhost:8002/";
//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const payload = { username, password, role };
//     console.log("Registration Data:", payload);

//     // Call API here
//     // fetch("your-api-endpoint", { method: "POST", ... })
    
//   };
const navigate = useNavigate();

const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { username, password, role };
    console.log("Registration Data:", payload);
try {
  const response = await axios.post(`${BASE_URL}register`, payload);
  console.log("Server Response:", response);
  alert("Registration successful!");
  navigate("/login");
} catch (error) {
  if (error.response) {
    console.error("Backend error:", error.response.data);
    alert(`Registration failed: ${error.response.data.detail || 'Unknown error'}`);
  } else {
    console.error("Request error:", error.message);
    alert("Could not connect to server.");
  }
}

    // try {
    //   const response = await axios.post(`${BASE_URL}register`, payload, {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   });
    //   console.log("Server Response:", response.data);
    //   alert("Registration successful!");
    // //   navigate("/Login"); 
    // } catch (error) {
    //   console.error("Error registering user:", error);
    //   alert("Registration failed!");
    // }
  };

  return (
    <>
    <Headers />
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h5" align="center" gutterBottom color="black" sx={{font:50, fontWeight:700}}>
          Registration
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />

   <FormControl fullWidth margin="normal">
  <InputLabel id="role-label">Role</InputLabel>
  <Select
    labelId="role-label"
    id="role"
    value={role}
    label="Role"
    onChange={(e) => setRole(e.target.value)}
    required
  >
    <MenuItem value="Admin">Admin</MenuItem>
    <MenuItem value="User">User</MenuItem>
  </Select>
</FormControl>


          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            
          >
            Register
          </Button>
        </form>
      </Box>
    </Container>
    </>
  );
};

export default Registration;
