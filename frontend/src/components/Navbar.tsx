import React from 'react';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4 }}>
          Admin Panel
        </Typography>
        <Box sx={{ flexGrow: 1 }}>
          <Button
            color="inherit"
            startIcon={<PeopleIcon />}
            onClick={() => navigate('/users')}
            sx={{ 
              mr: 2,
              backgroundColor: location.pathname === '/users' ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
            }}
          >
            Users
          </Button>
          <Button
            color="inherit"
            startIcon={<BarChartIcon />}
            onClick={() => navigate('/metrics')}
            sx={{ 
              backgroundColor: location.pathname === '/metrics' ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
            }}
          >
            Metrics
          </Button>
        </Box>
        <Button 
          color="inherit" 
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 