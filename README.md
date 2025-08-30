# Modern Note-Taking Web App

A full-stack note-taking application built with the MERN stack (MongoDB, Express.js, React, Node.js). It features a secure, dual-method authentication system allowing users to sign up and log in using either traditional email with an OTP (One-Time Password) or their Google account via OAuth 2.0.

Once authenticated, users can perform CRUD (Create, Read, Update, Delete) operations on their personal notes, with all data securely linked to their account.



---
## ✨ Features

- **Secure User Authentication**: Robust login and signup system.
  - **Email & OTP**: Passwordless authentication using one-time passwords sent to the user's email.
  - **Google OAuth 2.0**: Seamless sign-in with a Google account.
- **JWT-Based API Security**: Backend APIs are protected using JSON Web Tokens to ensure only authenticated users can access their data.
- **CRUD Operations for Notes**: Users can create, read, and delete their notes.
- **User-Specific Data**: Each user can only view and manage their own notes.
- **Responsive Design**: A clean, modern UI that works smoothly on both desktop and mobile devices.

---
## 🛠️ Tech Stack

- **Frontend**: React (with Vite), React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens), Passport.js (`passport-google-oauth20`)
- **Emailing**: Nodemailer (for OTP delivery)
- **Security & Middleware**: `cors`, `dotenv`

---
## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

You will need the following software installed on your computer:
- [Node.js](https://nodejs.org/en/) (which includes npm)
- [MongoDB](https://www.mongodb.com/try/download/community) (or a MongoDB Atlas account)
- [Git](https://git-scm.com/)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    cd your-repo-name
    ```

2.  **Backend Setup:**
    ```bash
    # Navigate to the backend folder
    cd backend

    # Install dependencies
    npm install

    # Create a .env file from the example
    cp .env.example .env
    ```
    Now, open the newly created `.env` file and fill in your credentials (MongoDB URI, Google Client ID/Secret, JWT Secret, etc.).

3.  **Frontend Setup:**
    ```bash
    # Navigate to the frontend folder from the root directory
    cd frontend

    # Install dependencies
    npm install
    ```

### Running the Application

You'll need to run the backend and frontend servers in two separate terminals.

1.  **Run the Backend Server:**
    ```bash
    # In the /backend directory
    npm start
    ```
    The server should now be running on `http://localhost:8000` (or the port you specified).

2.  **Run the Frontend Development Server:**
    ```bash
    # In the /frontend directory
    npm run dev
    ```
    The React app should now be running on `http://localhost:5173`.

---
## ⚙️ Environment Variables

The backend requires the following environment variables to be set in a `/backend/.env` file. Use the `.env.example` as a template.

| Variable              | Description                                        |
| --------------------- | -------------------------------------------------- |
| `PORT`                | The port for the backend server (e.g., `8000`).    |
| `CLIENT_URL`          | The URL of the frontend app (e.g., `http://localhost:5173`). |
| `MONGODB_URI`         | Your MongoDB connection string.                    |
| `JWT_SECRET`          | A long, random string for signing JWTs.            |
| `GOOGLE_CLIENT_ID`    | Your Google OAuth Client ID.                       |
| `GOOGLE_CLIENT_SECRET`| Your Google OAuth Client Secret.                   |
| `EMAIL_USER`          | Your email address for sending OTPs.               |
| `EMAIL_PASS`          | Your email password or app-specific password.      |

---
## 📄 API Endpoints

The following API routes are available:

| Method | Endpoint              | Description                      |
| ------ | --------------------- | -------------------------------- |
| `POST` | `/api/auth/send-otp`  | Sends an OTP to a user's email.  |
| `POST` | `/api/auth/verify-otp`| Verifies the OTP and user details.|
| `POST` | `/api/auth/login`     | Logs in a user with email and OTP.|
| `GET`  | `/api/auth/google`    | Initiates Google OAuth login.    |
| `GET`  | `/api/auth/profile`   | Gets the current logged-in user. |
| `GET`  | `/api/notes`          | Gets all notes for the user.     |
| `POST` | `/api/notes`          | Creates a new note.              |
| `DELETE`| `/api/notes/:id`      | Deletes a specific note.         |

---
## 📜 License

This project is licensed under the MIT License.
