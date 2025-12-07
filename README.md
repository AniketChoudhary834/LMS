# Learning Portal - Simplified MERN Stack Project

A beginner-friendly learning management system built with basic MERN stack (MongoDB, Express, React, Node.js) and Tailwind CSS.

## Features

- ✅ User Authentication (Register, Login, OTP Verification, Password Reset)
- ✅ Role-Based Access (Student & Instructor)
- ✅ Course Management (Create, Edit, Publish Courses)
- ✅ Course Enrollment (Free enrollment - no payment integration)
- ✅ Video Lecture System with Progress Tracking
- ✅ AI-Powered Quiz Generation (using Google Gemini)
- ✅ Course Progress Tracking
- ✅ Media Upload (Cloudinary integration)

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Tailwind CSS
- React Player (for video playback)
- Native Fetch API (no Axios)

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Bcrypt (password hashing)
- Nodemailer (email OTP)
- Google Generative AI (Gemini)
- Cloudinary (media storage)
- Multer (file uploads)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Setup Instructions

### 1. Clone/Navigate to the project

```bash
cd recreated
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GOOGLE_GENAI_API_KEY=your_gemini_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

**To get email app password (Gmail):**
1. Go to Google Account Settings
2. Security → 2-Step Verification → App Passwords
3. Generate a new app password for "Mail"

**To get Gemini API Key:**
1. Go to https://makersuite.google.com/app/apikey
2. Create a new API key

**To get Cloudinary credentials:**
1. Sign up at https://cloudinary.com
2. Get your cloud name, API key, and API secret from dashboard

### 3. Frontend Setup

```bash
cd ../client
npm install
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Project Structure

```
recreated/
├── server/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── helpers/         # Utility functions
│   ├── uploads/         # Temporary file storage
│   ├── server.js        # Entry point
│   └── package.json
│
└── client/
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── pages/       # Page components
    │   ├── context/     # React Context
    │   ├── utils/       # Utility functions
    │   ├── App.jsx      # Main app component
    │   └── main.jsx     # Entry point
    └── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/login` - Login user
- `GET /api/auth/check-auth` - Check authentication
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Courses
- `GET /api/courses` - Get all published courses
- `GET /api/courses/:id` - Get course details
- `GET /api/courses/instructor/all` - Get instructor's courses
- `POST /api/courses` - Create new course
- `PUT /api/courses/:id` - Update course
- `POST /api/courses/:id/enroll` - Enroll in course
- `GET /api/courses/student/enrolled` - Get enrolled courses
- `GET /api/courses/:id/check-enrollment` - Check enrollment

### Progress
- `GET /api/progress/:userId/:courseId` - Get course progress
- `POST /api/progress/mark-viewed` - Mark lecture as viewed
- `POST /api/progress/reset` - Reset progress

### Quiz
- `POST /api/quiz` - Generate quiz
- `POST /api/quiz/result` - Save quiz result
- `GET /api/quiz/results` - Get quiz results

### Media
- `POST /api/media/upload` - Upload file
- `DELETE /api/media/:id` - Delete file

## Usage Guide

### For Students:
1. Register/Login
2. Browse courses
3. Enroll in courses (free)
4. Watch video lectures
5. Track progress
6. Take AI-generated quizzes

### For Instructors:
1. Register/Login as Instructor
2. Create courses (3-step process)
3. Add curriculum (lectures)
4. Publish courses
5. View enrolled students

## Key Simplifications

This simplified version:
- ✅ Uses native `fetch` API instead of Axios
- ✅ Uses basic HTML elements with Tailwind CSS (no UI libraries)
- ✅ Removed payment integration (free enrollment)
- ✅ Simplified state management (basic React Context)
- ✅ Plain MERN stack - no advanced concepts

## Common Issues

1. **MongoDB Connection Error**: Check your MONGO_URI in .env
2. **Email Not Sending**: Verify EMAIL_USER and EMAIL_PASS in .env
3. **CORS Error**: Ensure CLIENT_URL matches your frontend URL
4. **Cloudinary Upload Fails**: Check Cloudinary credentials

## License

This is a learning project. Feel free to use and modify.

## Notes

- This is a simplified version for beginners
- No payment integration included
- Uses basic MERN stack concepts
- Perfect for learning and understanding the fundamentals


