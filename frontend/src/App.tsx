import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import Login from './components/Login';
import UserTable from './components/UserTable';
import MetricsPage from './pages/MetricsPage';
import Navbar from './components/Navbar';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const PrivateLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Navbar />
      <Box sx={{ mt: 2 }}>
        {children}
      </Box>
    </>
  );
};

function App() {
  return (
    <>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <PrivateLayout>
                  <UserTable />
                </PrivateLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/metrics"
            element={
              <PrivateRoute>
                <PrivateLayout>
                  <MetricsPage />
                </PrivateLayout>
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/users" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
