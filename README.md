

````markdown
# Restaurant Management System (MERN Stack)

A full-stack restaurant management web application built using the MERN stack (MongoDB, Express.js, React, Node.js).  
This project was developed as part of a WebStack Internship program focused on practical full-stack development.

## Project Overview

This application provides a complete system for managing restaurant operations, including user interaction, order processing, and administrative control. It follows a client-server architecture with a RESTful API backend and a React-based frontend.

## Features

### User Side
- User registration and authentication
- Browse restaurants and food items
- Add items to cart
- Place orders
- View order history
- Password reset functionality

### Admin Side
- Manage restaurants, menus, and food items
- View and manage orders
- User management
- Basic dashboard for system overview

## Tech Stack

### Frontend
- React.js
- Redux Toolkit
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

### Additional Services
- REST API architecture
- Cloudinary (image upload)
- Stripe (payment integration)
- dotenv for environment variables

## Project Structure

restaurantProject/
├── BackEnd/        (Node.js / Express backend)
├── frontend/       (React frontend)
└── README.md

## Installation and Setup

### 1. Clone the repository
```bash
git clone https://github.com/Khosrow-hub/restaurantManagementSystem.git
```

### 2. Backend Setup
```bash
cd BackEnd
npm install
```

Create a `.env` file:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=your_stripe_key
```

Run backend:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Learning Outcomes

- Full-stack application development using MERN stack
- REST API design and integration
- Authentication and authorization using JWT
- State management with Redux Toolkit
- Scalable project structure
- Real-world full-stack workflow experience

## Author

Xosrow Samadi  
WebStack Internship Program  
International Intern (Afghanistan)

## License

This project is for educational purposes only.
````
