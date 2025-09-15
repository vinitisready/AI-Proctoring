# AI-Proctored-System

An AI-powered exam proctoring system built with MERN stack.

## How to Run

### Prerequisites
- Node.js installed
- MongoDB running locally or connection string ready

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AI-Proctored-System-main
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

3. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Update the following variables:
     ```
     PORT=5000
     NODE_ENV=development
     MONGO_URL=mongodb://localhost:27017/proctordb
     JWT_SECRET=your_jwt_secret_key_here
     ```

4. **Run the application**
   
   **Option 1: Run both frontend and backend together**
   ```bash
   npm run dev
   ```
   
   **Option 2: Run separately**
   ```bash
   # Terminal 1 - Backend
   npm run server
   
   # Terminal 2 - Frontend
   npm run client
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## Creator

Created by [vinitisready](https://github.com/vinitisready)
