import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import MetricsChart from '../components/MetricsChart';
import { User } from '../components/UserTable';
import axios from 'axios';

// Create axios instance with auth token
const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const MetricsPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsersWithMetrics = async () => {
    try {
      setLoading(true);
      // Fetch users first
      const usersResponse = await api.get('/users');
      const users = usersResponse.data;

      // Fetch metrics for each user
      const usersWithMetrics = await Promise.all(
        users.map(async (user: User) => {
          try {
            const metricsResponse = await api.get(`/users/${user.id}/metrics`);
            return {
              ...user,
              metrics: metricsResponse.data
            };
          } catch (error) {
            console.error(`Error fetching metrics for user ${user.id}:`, error);
            return user;
          }
        })
      );

      setUsers(usersWithMetrics);
      setError(null);
    } catch (error) {
      console.error('Error fetching users and metrics:', error);
      setError('Failed to load metrics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersWithMetrics();
  }, []);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3 
      }}>
        <Typography variant="h4">
          Activity Metrics
        </Typography>
        <Button 
          variant="outlined"
          onClick={fetchUsersWithMetrics}
          startIcon={<RefreshIcon />}
        >
          Refresh
        </Button>
      </Box>
      <Box sx={{ height: '70vh' }}>
        <MetricsChart users={users} />
      </Box>
    </Box>
  );
};

export default MetricsPage; 