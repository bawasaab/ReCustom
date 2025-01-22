import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Box, Paper, Typography, Grid, Card, CardContent } from '@mui/material';
import type { User } from './UserTable';
import PersonIcon from '@mui/icons-material/Person';
import DownloadIcon from '@mui/icons-material/Download';
import LoginIcon from '@mui/icons-material/Login';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MetricsChartProps {
  users: User[];
}

const MetricsChart: React.FC<MetricsChartProps> = ({ users }) => {
  // Helper function to count activities
  const getActivityCounts = (activityLogs: User['activityLogs'] = []) => {
    return {
      logins: activityLogs.filter(log => log.action === 'LOGIN').length,
      downloads: activityLogs.filter(log => log.action === 'DOWNLOAD_PDF').length
    };
  };

  // Calculate total metrics
  const totalMetrics = users.reduce((totals, user) => {
    const counts = getActivityCounts(user.activityLogs);
    return {
      logins: totals.logins + counts.logins,
      downloads: totals.downloads + counts.downloads,
      totalActivities: totals.totalActivities + counts.logins + counts.downloads
    };
  }, { logins: 0, downloads: 0, totalActivities: 0 });

  const chartData = {
    labels: users.map(user => `${user.firstName} ${user.lastName}`),
    datasets: [
      {
        label: 'PDF Downloads',
        data: users.map(user => getActivityCounts(user.activityLogs).downloads),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Logins',
        data: users.map(user => getActivityCounts(user.activityLogs).logins),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          footer: (tooltipItems: any) => {
            const userIndex = tooltipItems[0].dataIndex;
            const user = users[userIndex];
            const lastActivity = user.activityLogs
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
            if (lastActivity) {
              return `Last Activity: ${new Date(lastActivity.timestamp).toLocaleString()}`;
            }
            return '';
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  // Find most active user
  const mostActiveUser = users.reduce((prev, current) => {
    const prevCounts = getActivityCounts(prev.activityLogs);
    const currentCounts = getActivityCounts(current.activityLogs);
    const prevTotal = prevCounts.logins + prevCounts.downloads;
    const currentTotal = currentCounts.logins + currentCounts.downloads;
    return currentTotal > prevTotal ? current : prev;
  }, users[0]);

  const getLastActivityDate = (user: User) => {
    const lastActivity = user.activityLogs
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    return lastActivity ? new Date(lastActivity.timestamp) : null;
  };

  return (
    <Box>
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <LoginIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
              <Box>
                <Typography variant="h4">{totalMetrics.logins}</Typography>
                <Typography color="textSecondary">Total Logins</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <DownloadIcon sx={{ fontSize: 40, mr: 2, color: 'secondary.main' }} />
              <Box>
                <Typography variant="h4">{totalMetrics.downloads}</Typography>
                <Typography color="textSecondary">Total Downloads</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <PersonIcon sx={{ fontSize: 40, mr: 2, color: 'success.main' }} />
              <Box>
                <Typography variant="h6" noWrap>
                  {mostActiveUser ? `${mostActiveUser.firstName} ${mostActiveUser.lastName}` : 'N/A'}
                </Typography>
                <Typography color="textSecondary">Most Active User</Typography>
                {mostActiveUser && getLastActivityDate(mostActiveUser) && (
                  <Typography variant="caption" display="block">
                    Last active: {getLastActivityDate(mostActiveUser)?.toLocaleDateString()}
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Chart */}
      <Paper sx={{ p: 2, height: '400px' }}>
        <Typography variant="h6" gutterBottom>
          User Activity Comparison
        </Typography>
        <Box sx={{ height: 'calc(100% - 40px)' }}>
          <Bar data={chartData} options={options} />
        </Box>
      </Paper>
    </Box>
  );
};

export default MetricsChart; 