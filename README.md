# Emergency Social Network (ESN)

> A community-driven emergency coordination platform built to connect citizens, volunteers, and health service providers during crisis situations.

---

## Table of Contents

1. [Overall Summary](#overall-summary)
2. [The Problem](#the-problem)
3. [Aim of the Project](#aim-of-the-project)
4. [Scope](#scope)
5. [Solution](#solution)
6. [Tech Stack](#tech-stack)
7. [Project Structure](#project-structure)
8. [Features](#features)
9. [API Overview](#api-overview)
10. [Environment Variables](#environment-variables)
11. [How to Start the Application](#how-to-start-the-application)
12. [Running Tests](#running-tests)

---

## Overall Summary

The **Emergency Social Network (ESN)** is a full-stack web application developed as a Carnegie Mellon University community project. It provides a real-time, location-aware social platform designed specifically for use during emergencies and community crises. The system allows citizens to communicate publicly and privately, share their safety status, request emergency help via a panic button, receive official announcements, and connect with external health service companies — all within a single coordinated platform.

The application is built on **Node.js + Express.js**, uses **MongoDB** as its database, and leverages **Socket.io** for real-time communication. A Pug-based server-rendered UI provides views for key interactions, while a RESTful API backs the entire system.

---

## The Problem

During natural disasters, civil emergencies, or community crises, standard communication infrastructure often becomes overwhelmed or unavailable. Citizens face several compounding challenges:

- **No single place to communicate** — people are scattered across SMS, social media, and phone calls with no shared situational awareness.
- **Unknown safety status of others** — friends, family, and neighbours cannot easily signal whether they are safe, injured, or need assistance.
- **Delayed emergency response** — traditional emergency services can be overloaded, while willing volunteers nearby have no mechanism to coordinate.
- **No integration with health services** — external health companies and emergency responders operate in silos with no direct connection to the affected community.
- **Information overload vs. silence** — either there is too much unverified information or complete silence; there is no trusted channel for official announcements.

---

## Aim of the Project

The core aims of this project are to:

1. **Provide a unified communication hub** for community members during and after emergencies.
2. **Enable real-time status sharing** so that everyone can know who is safe, who needs help, and who is able to respond.
3. **Streamline volunteer coordination** through a panic button system that matches people in distress with nearby responders automatically.
4. **Integrate external health service providers** into the community response ecosystem via a dedicated onboarding and approval workflow.
5. **Ensure secure, role-based access** so that administrators, citizens, and external companies each have appropriate levels of interaction.
6. **Persist all communications** — messages, announcements, and statuses — so that the community has a reliable record of events during a crisis.

---

## Scope

The project covers the following domains:

| Domain | In Scope |
|---|---|
| User Management | Registration, login, profiles, roles (citizen / admin), user directory |
| Real-time Messaging | Public chat room, private 1-to-1 messaging, Socket.io events |
| Announcements | Admin-created community-wide broadcasts with real-time push |
| Safety Status | Citizen-reported status (e.g., Safe, Need Help, Injured) with colour codes |
| Panic Button | SOS requests, volunteer responder matching by proximity, email notification |
| External Companies | Health service company registration, approval workflow, and dedicated portal |
| Document Library | Community resource documents (learn-and-support module) |
| Security | JWT authentication, bcrypt password hashing, protected routes |
| Testing | Unit tests (Jest) and integration tests with coverage reporting |

**Out of scope for the current version:**
- Mobile native applications
- Integration with government emergency dispatch systems (911/112)
- Offline/SMS fallback communication
- Payment or subscription management

---

## Solution

ESN addresses the above problems through four interconnected systems:

### 1. Real-Time Communication Layer
Powered by **Socket.io**, the platform maintains persistent WebSocket connections so that public messages, private messages, announcements, and panic alerts are delivered instantly without page refreshes. An `onlineUsersMap` tracks who is currently active in the system at any moment.

### 2. Safety Status System
Each citizen can set a colour-coded status (e.g., green = OK, yellow = needs supply, red = injured) with a free-text explanation. Other users and administrators can view these statuses in the user directory, giving an at-a-glance overview of community health.

### 3. Panic Button & Volunteer Responder System
Citizens in distress press the panic button, which broadcasts an SOS containing their geolocation. The system:
- Identifies registered volunteer responders.
- Filters responders within approximately **10 km** using Haversine distance calculation.
- Sends an **automated email via Gmail SMTP** with a direct Google Maps link to the requester's coordinates.
- Emits a real-time `panicButtonRequest` Socket.io event to all connected responders.
- Allows a responder to accept the request, confirming their commitment and broadcasting a `panicRequestAccepted` event.

### 4. External Health Company Integration
Health service companies register through a separate portal. Their accounts start as `inactive` and require administrator approval before gaining access. Once approved, they appear in a health company directory where citizens can find and contact them during emergencies.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Web Framework | Express.js 4.17.3 |
| Database | MongoDB (Atlas cloud) via Mongoose |
| Real-time | Socket.io 4.4.1 |
| Templating | Pug 3.0.2 |
| Authentication | JWT (jsonwebtoken 8.5.1) |
| Password Hashing | bcryptjs 2.4.3 |
| File Uploads | Multer 1.4.4 |
| Email | Nodemailer 6.7.3 (Gmail SMTP) |
| Transpilation | Babel (ES6+) |
| Testing | Jest 27.5.1 |
| Linting | ESLint |
| Dev Server | Nodemon |

---

## Project Structure

```
├── index.js                    # Application entry point, Express + Socket.io setup
├── Config/
│   ├── config.js               # Environment-based configuration (dev/test/prod)
│   ├── data.js                 # MongoDB connection string
│   └── websockets.js           # Socket.io event registration and online user tracking
├── Controller/
│   ├── userController.js       # User CRUD operations
│   ├── messageController.js    # Public and private messaging
│   ├── announcementController.js
│   ├── panicButtonController.js
│   ├── userStatusController.js
│   ├── ExternalCompanyController.js
│   └── learn-and-support-controllers/
├── Models/                     # Mongoose schemas
│   ├── user.js
│   ├── message.js
│   ├── announcement.js
│   ├── user_status.js
│   └── ExternalCompanyModel.js
├── Routes/                     # Express route definitions
├── Services/
│   ├── EmailService.js         # Gmail SMTP integration
│   ├── PanicButtonService.js   # Emergency response logic + geolocation
│   └── NotificationService.js  # Socket.io event emitter
├── Middlewares/
│   └── auth.js                 # JWT verification middleware
├── views/                      # Pug HTML templates
├── public/                     # Static assets (CSS, JS, images, audio)
├── UnitTests/                  # Jest unit tests
└── IntegrationTests/           # Jest integration tests
```

---

## Features

### User Management
- Register a new citizen account with username, name, email, and password.
- Login returns a signed JWT used for all authenticated requests.
- View and update your own profile (name, email, location coordinates).
- Admin users can view all users, change privilege levels, and deactivate accounts.
- Browsable user directory showing all active community members.

### Real-Time Public Chat
- All authenticated users can post and read messages in a shared public chat room.
- Messages are persisted in MongoDB and loaded on page open.
- New messages appear instantly via Socket.io without reloading.

### Private Messaging
- Send a direct message to any specific user.
- Private message threads are visible only to the two participants.

### Announcements
- Administrators post community-wide announcements.
- Announcements are broadcast to all connected clients in real time.
- Full announcement history is retrievable via the API.

### Safety Status Sharing
- Citizens set a status from a predefined set (colour + label + explanation).
- Status is visible in the user directory and on individual profiles.
- Timestamps record when statuses were last updated.

### Panic Button — Emergency SOS
- Any citizen can trigger an SOS from within their profile.
- The system records the user's latitude/longitude at the time of the request.
- Volunteer responders opted into the system receive:
  - A real-time Socket.io push notification (`panicButtonRequest` event).
  - An email with the requester's name and a Google Maps link to their location.
- A responder within ~10 km can accept the request, triggering a `panicRequestAccepted` broadcast.
- Volunteers can enable/disable their availability through account settings.

### External Health Companies
- Separate registration and login portal for health service organisations.
- Accounts require admin approval before becoming active.
- Citizens can browse approved health companies and view their contact details.

### Document Library (Learn & Support)
- Users can upload and share help documents and community resources.
- Documents are retrievable by all authenticated users.

---

## API Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/users/register` | Register a new user | No |
| POST | `/users/login` | Login and receive JWT | No |
| GET | `/users` | List all active users | Yes |
| GET | `/users/:id` | Get user by ID | Yes |
| PATCH | `/users/:id` | Update user profile | Yes |
| DELETE | `/users/:id` | Delete user | Yes (Admin) |
| GET | `/messages` | Get all public messages | Yes |
| POST | `/messages` | Post a public message | Yes |
| GET | `/messages/private/:id` | Get private messages with user | Yes |
| POST | `/messages/private` | Send a private message | Yes |
| GET | `/announcements` | Get all announcements | Yes |
| POST | `/announcements` | Create announcement | Yes (Admin) |
| DELETE | `/announcements/:id` | Delete announcement | Yes (Admin) |
| POST | `/panic-button/send` | Trigger SOS request | Yes |
| POST | `/panic-button/accept` | Accept a help request | Yes |
| POST | `/panic-button/update-settings` | Toggle volunteer availability | Yes |
| POST | `/company/register` | Register external company | No |
| POST | `/company/login` | External company login | No |
| GET | `/company` | List approved health companies | Yes |

---

## Environment Variables

Create a `.env` file in the project root with the following values before starting the application:

```env
# Application
NODE_ENV=development
PORT=8080

# JWT
SECRET_KEY=your_jwt_secret_key_here

# MongoDB Atlas
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

# Gmail SMTP (for panic button email notifications)
GMAIL_USER=your_gmail_address@gmail.com
GMAIL_PASS=your_gmail_app_password
```

> **Note:** For `GMAIL_PASS`, use a [Google App Password](https://support.google.com/accounts/answer/185833), not your regular Gmail password. Two-factor authentication must be enabled on the account.

---

## How to Start the Application

### Prerequisites

| Requirement | Version |
|---|---|
| Node.js | >= 14.x |
| npm | >= 6.x |
| MongoDB Atlas account | (or local MongoDB >= 4.x) |

### Steps

**1. Clone the repository**

```bash
git clone https://github.com/pattyish/community-emergence-social-network.git
cd community-emergence-social-network
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

Create a `.env` file in the project root and populate it with the values listed in the [Environment Variables](#environment-variables) section above.

**4. Start the application**

```bash
# Development mode (with auto-restart via nodemon)
npm run dev

# Production mode
npm start
```

**5. Open the application**

Navigate to [http://localhost:8080](http://localhost:8080) in your browser.

The landing page gives options to:
- **Register / Login** as a citizen
- **Sign up / Login** as an external health service company

### Default Admin Account

After registering a standard account, update the `privilege` field to `"admin"` directly in your MongoDB database to bootstrap the first administrator. All subsequent admin promotions can then be performed from within the application.

---

## Running Tests

```bash
# Run all tests (unit + integration) with coverage
npm test

# Run unit tests only
npx jest UnitTests/

# Run integration tests only
npx jest IntegrationTests/

# View HTML coverage report (macOS/Linux)
open coverage/lcov-report/index.html

# View HTML coverage report (Windows)
start coverage/lcov-report/index.html
```

Test coverage reports are generated in the `coverage/` directory after each run.

---

## License

This project was developed as part of a university software engineering course. Please review the repository for any applicable licensing terms before reuse.
