Todo Application Project

Project Description

This application is a comprehensive task management system built as the Second Semester Examination project for the AltSchool of Frontend Engineering (Karatu 2025). The project demonstrates proficiency in React 19, professional routing, API integration, and accessible UI design. Users can manage their tasks through a paginated list, view detailed information for individual items, and perform full CRUD operations.

Features

Paginated Todo List: Displays 10 items per page with clear navigation controls.

Todo Details: Nested routing to view comprehensive information about a specific task.

Search and Filtering: Real-time search by title and filtering by completion status (All, Complete, Incomplete).

CRUD Operations: Full ability to create, edit, and delete tasks with confirmation dialogs.

Advanced Error Handling: Implementation of React Error Boundaries and a custom 404 page.

State Management: Efficient data fetching and caching.

Accessibility: Semantic HTML, ARIA attributes, and keyboard navigation support.

Responsive Design: Mobile-first approach ensuring usability across all device sizes.

Technology Choices and Reasoning

React 19: Utilized for its latest functional component patterns, Hooks, and improved performance.

React Router: Chosen for robust client-side routing, handling nested routes for Todo details, and managing the 404 redirect logic.

Vanilla CSS: Used for styling to demonstrate a deep understanding of CSS architecture and responsive design without external library overhead.

Tanstack Query (suggested): Implemented for server-state management, providing out-of-the-box caching and loading/error states.

Lucide React: Integrated for a consistent and accessible icon system.

Setup Instructions

To run this project locally, follow these steps:

Clone the repository:

Bash

git clone [[your-repository-link](https://github.com/Josh-codes165/AltSchool-Second-Semester-Project-Exam)]
Navigate to the project directory:

Bash

cd todo-app-project
Install dependencies:

Bash

npm install
Start the development server:

Bash

npm run dev
Open your browser and navigate to http://localhost:5173 (or the port specified in your terminal).

Available Scripts

npm run dev: Runs the app in the development mode.

npm run build: Builds the app for production to the dist folder.

npm run preview: Locally previews the production build.

npm run lint: Runs ESLint to check for code quality issues.

API Configuration

This project integrates with the following backend:

Base URL: https://api.oluwasetemi.dev

Endpoints utilized: /todos, /todos/{id}, /auth/login, /auth/register.


Deployment
The project is hosted on [Vercel/Netlify/PipeOps].

Live URL: [[Your Deployed URL Link](https://alt-school-second-semester-project-gray.vercel.app/)]

Known Issues and Future Improvements

Known Issue: Rapidly switching pagination pages can occasionally lead to a brief race condition in data fetching if the network is extremely slow.

Improvement: Implement WebSocket integration using the /ws/tasks endpoint for real-time updates across multiple sessions.

Improvement: Add more robust offline support using Service Workers for a full PWA experience.

DONE BY JOSHUA OKORONKWO