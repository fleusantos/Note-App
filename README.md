# Note App

A modern note-taking application built with Django and Next.js, featuring real-time updates, categorization, and a clean user interface.

## Quick Start Guide

### Backend Setup
1. Create and activate virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Run migrations and start server:
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```
   Backend will be available at http://localhost:8000

### Frontend Setup
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```
   Frontend will be available at http://localhost:3000

## Development Process

The application was developed through several key phases:

1. **Project Foundation**
   - Set up initial project structure with Django backend and Next.js frontend
   - Implemented JWT authentication system for secure user management

2. **Core Features Development**
   - Created authentication pages with modern design
   - Developed dashboard interface for note management
   - Implemented note categorization system
   - Added real-time note creation and editing functionality

3. **UI/UX Enhancements**
   - Improved note card and modal designs
   - Enhanced date display formatting
   - Refined category management interface
   - Optimized responsive layout

4. **Final Polishing**
   - Added security improvements
   - Fixed build and deployment issues
   - Enhanced overall user experience

## AI Tools Used in Development

During the development process, I leveraged several AI tools to enhance productivity and problem-solving:

1. **Tabnine (VS Code Extension)**
   - Used for generating short code blocks based on context
   - Helped with quick code completion and bug fixes
   - Improved development speed for routine coding tasks

2. **ChatGPT**
   - Utilized for solving more complex programming challenges
   - Assisted with architectural decisions and problem-solving
   - Helped in debugging and finding optimal solutions

## Key Technical Decisions

1. **Authentication**
   - JWT (JSON Web Tokens) for secure, stateless authentication
   - Protected routes on both frontend and backend
   - Centralized auth state management

2. **Frontend Architecture**
   - Next.js 13+ with App Router for improved performance and SEO
   - TypeScript for type safety and better development experience
   - Component-based architecture for reusability
   - date-fns for consistent date formatting

3. **Backend Design**
   - Django REST framework for robust API development
   - Simple JWT for token authentication
   - Structured models for notes and categories

4. **UI/UX Choices**
   - Modal-based note creation/editing for seamless experience
   - Category-based organization with visual color coding
   - Responsive grid layout for notes display
   - Intuitive date formatting (today/yesterday for recent notes)