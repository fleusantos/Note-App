# Django + Next.js Full-Stack Application

This is a full-stack application using Django for the backend and Next.js for the frontend.

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run migrations:
   ```bash
   python manage.py migrate
   ```
5. Start the Django server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Access the Application
- Backend API: http://localhost:8000
- Frontend: http://localhost:3000

## Super User

Mail: admin@mail.com
Password: 123

## Install necessary library

cd /home/superdev/Documents/Projects/memo && source .venv/bin/activate && pip install djangorestframework-simplejwt

## Run Server

python manage.py runserver