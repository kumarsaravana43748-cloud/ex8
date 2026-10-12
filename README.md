# Student Attendance Monitoring System

A real-time student attendance monitoring web application built with Node.js and Express.

## Features

- **Dashboard Statistics**: Real-time display of total students, present count, absent count, and overall attendance percentage.
- **Student Management**: Add new students dynamically.
- **Attendance Marking**: Toggle student status between Present and Absent.
- **RESTful API**: Clean REST endpoints for student and attendance operations.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **API**: RESTful JSON API

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/students` | Get list of all students |
| `POST` | `/api/students` | Add a new student (`{ "name": "..." }`) |
| `POST` | `/api/attendance/:id` | Mark student as Present |
| `DELETE` | `/api/attendance/:id` | Mark student as Absent |
| `GET` | `/api/attendance` | Get attendance statistics and records |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```
