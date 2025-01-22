# User Management System

A modern React-based user management system with activity tracking and analytics. Built with TypeScript, Material-UI, and Chart.js.

## Features

### User Management
- Create, Read, Update, and Delete (CRUD) operations for users
- Role-based user management (Admin/User)
- Secure password handling
- Real-time search functionality
- Pagination for better data handling
- Activity logging for user actions

### Analytics & Reporting
- Visual analytics dashboard
- User activity metrics visualization
- PDF report generation for individual users
- Activity tracking (Logins and Downloads)
- Real-time activity monitoring

### Security
- JWT-based authentication
- Protected routes
- Secure API communication
- Role-based access control

### UI/UX
- Modern Material Design interface
- Responsive layout
- Interactive data visualization
- User-friendly notifications
- Search and filter capabilities
- Intuitive navigation

## Tech Stack

- **Frontend**:
  - React
  - TypeScript
  - Material-UI (MUI)
  - Chart.js
  - Axios
  - React Router

- **Development**:
  - Vite
  - ESLint
  - Prettier

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API server running

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/user-management-system.git
```

2. Install dependencies:
```bash
cd user-management-system
npm install
```

3. Create a `.env` file in the root directory:
```env:c:\Users\user\Documents\GitHub\ReCustom\frontend\README.md
VITE_API_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/
│   ├── Login.tsx
│   ├── UserTable.tsx
│   ├── MetricsChart.tsx
│   └── Navbar.tsx
├── pages/
│   └── MetricsPage.tsx
├── App.tsx
└── main.tsx
```

## Features in Detail

### User Management
- **User Listing**: Display users with pagination and search
- **User Creation**: Add new users with role assignment
- **User Editing**: Modify user details and roles
- **User Deletion**: Remove users with confirmation
- **Activity Tracking**: Monitor user logins and downloads

### Analytics Dashboard
- **Activity Metrics**: Visual representation of user activities
- **Login Statistics**: Track user login patterns
- **Download Analytics**: Monitor PDF download frequency
- **User Comparison**: Compare activity levels across users

### Reporting
- **PDF Generation**: Create detailed user activity reports
- **Activity Timeline**: Track user actions chronologically
- **Custom Formatting**: Well-designed, professional reports
- **Instant Download**: Quick access to user reports

## API Integration

The system communicates with a RESTful API server:

- `GET /users`: Fetch all users
- `POST /users`: Create new user
- `PATCH /users/:id`: Update user
- `DELETE /users/:id`: Delete user
- `GET /users/:id/metrics`: Get user metrics
- `POST /users/:id/pdf`: Generate user PDF report

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Material-UI for the awesome component library
- Chart.js for the beautiful visualizations
- The React community for inspiration and support 
