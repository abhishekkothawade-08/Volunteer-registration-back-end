# Volunteer Registration System

A full-stack Volunteer Registration System that allows volunteers to register and enables administrators to manage volunteer applications, track approval status, and view volunteer statistics.

## Features

- Volunteer registration
- User authentication and authorization
- Volunteer dashboard
- Admin dashboard
- Approve or reject volunteer applications
- Track volunteer application status
- View volunteer statistics and reports

## Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JSON Web Tokens (JWT)
- **Frontend:** React.js
- **API Testing:** Postman

## Prerequisites

Before running the project, install:

- Node.js and npm
- MongoDB or a MongoDB Atlas account
- Git

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/abhishekkothawade-08/Volunteer-registration-back-end.git
cd Volunteer-registration-back-end
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root and configure the required variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Replace the placeholder values with your own configuration. Never upload your `.env` file or expose your credentials.

### 4. Start the server

Check the `scripts` section of `package.json` for the available start command. If the project uses a `start` script, run:

```bash
npm start
```

For development, if a `dev` script is configured, run:

```bash
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/volunteers` | Retrieve volunteers |
| GET | `/api/volunteers/stats` | View volunteer statistics |
| POST | `/api/volunteers` | Register a volunteer |
| PUT | `/api/volunteers/approve/:id` | Approve a volunteer |
| PUT | `/api/volunteers/reject/:id` | Reject a volunteer |
| DELETE | `/api/volunteers/:id` | Delete a volunteer |

Some endpoints may require authentication or administrator privileges.

## Project Purpose

This project aims to simplify volunteer registration and administrative management through a centralized application.

## Future Improvements

- Email notifications for application status updates
- Enhanced reporting and analytics
- Improved user interface and accessibility

## Author

**Abhishek Kothawade**

GitHub: [abhishekkothawade-08](https://github.com/abhishekkothawade-08)

## License

This project is available for educational and personal use. Add a license file if you intend to specify formal reuse permissions.
