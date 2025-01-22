# User Activity Tracker

A NestJS application for tracking user activities and generating activity reports.

## Features

- 👥 User Management (CRUD operations)
- 🔐 Authentication with JWT
- 👮 Role-based Access Control (Admin/User)
- 📊 Activity Logging
- 📑 PDF Report Generation
- 🔄 Real-time Activity Tracking
- 📈 Activity Metrics and Analytics

## Tech Stack

- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- JWT Authentication
- PDFKit
- bcrypt

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Installation

1. Clone the repository:
- `git clone https://github.com/bawasaab/ReCustom.git`
- ```bash
git clone https://github.com/bawasaab/ReCustom.git
```
- ```bash
cd user-activity-tracker
```


2. Install dependencies:


3. Create a `.env` file in the root directory:
- `DB_HOST=localhost`
- `DB_PORT=5432`
- `DB_USERNAME=postgres`
- `DB_PASSWORD=your_password`
- `DB_NAME=activity_tracker`
- `JWT_SECRET=your_jwt_secret`

4. Start the application:
Development
npm run start:dev

Production
- `npm run build`
- `npm run start:prod`


## Database Seeding

Populate the database with initial data:
- `npm run seed`


## API Endpoints

### Authentication
- `POST /auth/login` - User login

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `GET /users/:id/metrics` - Get user activity metrics
- `GET /users/:id/pdf` - Generate user activity report (PDF)
- `GET /users/:id/activity-logs` - Get user activity history
- `POST /users/:id/activity` - Log new activity

## Activity Types

- LOGIN
- DOWNLOAD_PDF
- Custom activities via API

## PDF Report Features

- User Information
- Activity Metrics
- Activity Breakdown
- Recent Activities List
- Professional Layout with Tables
- Color-coded Sections

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
