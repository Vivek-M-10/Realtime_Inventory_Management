import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
export default function ButtonAppBar() {
  const username = localStorage.getItem("username") || "Guest";
  const role = localStorage.getItem("role") || "Visitor";

const navigate = useNavigate();
  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    // Navigate to login
    navigate("/login");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/* Left menu icon */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          {/* App title */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Smart Warehouse Management
          </Typography>

          {/* User info */}
          <Stack direction="row" spacing={1} alignItems="center">
      <Avatar alt={username} src="" /> {/* API avatar later */}
      <Box>
        <Typography variant="body1">{username}</Typography>
        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          {role}
        </Typography>
      </Box>
      <IconButton onClick={handleLogout} sx={{ ml: 1 }}>
        <LogoutIcon />
      </IconButton>
    </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
