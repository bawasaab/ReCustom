import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Snackbar,
  Alert,
  Tooltip,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  TextField as SearchField,
  InputAdornment,
  TablePagination,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import qs from 'qs';
import SearchIcon from '@mui/icons-material/Search';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  password?: string;
  activityLogs: {
    id: number;
    action: 'LOGIN' | 'DOWNLOAD_PDF';
    description: string;
    timestamp: string;
  }[];
}

interface EditDialogProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSave: (user: User) => void;
}

interface NewUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

const EditDialog: React.FC<EditDialogProps> = ({ open, user, onClose, onSave }) => {
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [password, setPassword] = useState('');

  useEffect(() => {
    setEditedUser(user);
    setPassword('');
  }, [user]);

  if (!editedUser) return null;

  // Separate handlers for text fields and select
  const handleTextChange = (field: keyof Omit<User, 'id' | 'activityLogs' | 'password'>) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditedUser({
      ...editedUser,
      [field]: event.target.value
    });
  };

  const handleRoleChange = (event: SelectChangeEvent) => {
    setEditedUser({
      ...editedUser,
      role: event.target.value
    });
  };

  const handleSave = () => {
    if (!editedUser) return;
    
    const updatedUser: User = {
      ...editedUser,
      ...(password ? { password } : {})
    };
    onSave(updatedUser);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="First Name"
          type="text"
          fullWidth
          value={editedUser.firstName}
          onChange={handleTextChange('firstName')}
        />
        <TextField
          margin="dense"
          label="Last Name"
          type="text"
          fullWidth
          value={editedUser.lastName}
          onChange={handleTextChange('lastName')}
        />
        <TextField
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          value={editedUser.email}
          onChange={handleTextChange('email')}
        />
        <TextField
          margin="dense"
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          helperText="Leave blank to keep current password"
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Role</InputLabel>
          <Select
            value={editedUser.role}
            label="Role"
            onChange={handleRoleChange}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="user">User</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const initialNewUser: NewUser = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: 'user'
};

// Update the axios instance to include the auth token
const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
});

// Add request interceptor to include token in all requests
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

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState<NewUser>(initialNewUser);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      showSnackbar('Error fetching users', 'error');
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleEditSave = async (editedUser: User) => {
    try {
      await api.patch(`/users/${editedUser.id}`, editedUser);
      await fetchUsers(); // Fetch all users and their metrics
      setEditDialogOpen(false);
      showSnackbar('User updated successfully', 'success');
    } catch (error) {
      console.error('Error updating user:', error);
      showSnackbar('Error updating user', 'error');
    }
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    try {
      await api.delete(`/users/${selectedUser.id}`);
      await fetchUsers(); // Fetch all users and their metrics
      setDeleteDialogOpen(false);
      showSnackbar('User deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting user:', error);
      showSnackbar('Error deleting user', 'error');
    }
  };

  const handleDownloadPDF = async (userId: number) => {
    try {
      const response = await api.get(`/users/${userId}/pdf`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `user-${userId}-report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);

    } catch (error) {
      console.error('Error downloading PDF:', error);
      showSnackbar('Error downloading PDF', 'error');
    }
  };

  const handleAddUser = async () => {
    try {
      await api.post('/users', newUser);
      await fetchUsers(); // Fetch all users and their metrics
      setAddDialogOpen(false);
      setNewUser(initialNewUser);
      showSnackbar('User added successfully', 'success');
    } catch (error) {
      console.error('Error adding user:', error);
      showSnackbar('Error adding user', 'error');
    }
  };

  const handleNewUserTextChange = (field: keyof NewUser) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewUser({
      ...newUser,
      [field]: event.target.value
    });
  };

  const handleNewUserRoleChange = (
    event: SelectChangeEvent<string>
  ) => {
    setNewUser({
      ...newUser,
      role: event.target.value
    });
  };

  // Helper function to count activities
  const getActivityCounts = (activityLogs: User['activityLogs'] = []) => {
    return {
      logins: activityLogs.filter(log => log.action === 'LOGIN').length,
      downloads: activityLogs.filter(log => log.action === 'DOWNLOAD_PDF').length
    };
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(searchTerm) ||
      user.lastName.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.role.toLowerCase().includes(searchTerm)
    );
  });

  // Get current page of users
  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      {/* Header with search */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="h4">
          User Management
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: 2,
          flexWrap: 'wrap',
          flex: 1,
          justifyContent: 'flex-end'
        }}>
          <SearchField
            size="small"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ minWidth: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setAddDialogOpen(true)}
          >
            Add User
          </Button>
        </Box>
      </Box>

      {/* User Table Container */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell align="center">Total Logins</TableCell>
              <TableCell align="center">Total PDF Downloads</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => {
              const counts = getActivityCounts(user.activityLogs);
              return (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell align="center">
                    <Tooltip 
                      title={user.activityLogs
                        .filter(log => log.action === 'LOGIN')
                        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                        .slice(0, 1)
                        .map(log => `Last login: ${new Date(log.timestamp).toLocaleString()}`)
                        [0] || 'No login history'
                      } 
                      arrow
                    >
                      <span>{counts.logins}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip 
                      title={user.activityLogs
                        .filter(log => log.action === 'DOWNLOAD_PDF')
                        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                        .slice(0, 1)
                        .map(log => `Last download: ${new Date(log.timestamp).toLocaleString()}`)
                        [0] || 'No download history'
                      } 
                      arrow
                    >
                      <span>{counts.downloads}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(user)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(user)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDownloadPDF(user.id)}
                    >
                      <PictureAsPdfIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
            {paginatedUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="textSecondary">
                    {users.length === 0 ? 'No users found' : 'No matching users found'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredUsers.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        sx={{ mt: 2 }}
      />

      <EditDialog
        open={editDialogOpen}
        user={selectedUser}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleEditSave}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this user?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={addDialogOpen}
        onClose={() => {
          setAddDialogOpen(false);
          setNewUser(initialNewUser);
        }}
      >
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="First Name"
            type="text"
            fullWidth
            value={newUser.firstName}
            onChange={handleNewUserTextChange('firstName')}
          />
          <TextField
            margin="dense"
            label="Last Name"
            type="text"
            fullWidth
            value={newUser.lastName}
            onChange={handleNewUserTextChange('lastName')}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={newUser.email}
            onChange={handleNewUserTextChange('email')}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={newUser.password}
            onChange={handleNewUserTextChange('password')}
            required
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Role</InputLabel>
            <Select
              value={newUser.role}
              label="Role"
              onChange={handleNewUserRoleChange}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setAddDialogOpen(false);
            setNewUser(initialNewUser);
          }}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddUser} 
            variant="contained" 
            color="primary"
            disabled={!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.password || !newUser.role}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserTable; 