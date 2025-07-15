# Inventory & Sales Management System

A full-stack application for managing inventory, tracking sales, viewing low-stock alerts, and analyzing sales data with dynamic charts.  

Built with **React**, **Express**, **MongoDB**, **Firebase Auth**, and **Recharts** for data visualization.



---

## 🚀 Features

✅ User Authentication  
- Email/password login  
- Google sign-in with Firebase  
- JWT-based authorization

✅ Role-based Dashboard Routing  
- Admin → `/admin`  
- Cashier → `/sales`  
- Inventory Manager → `/inventory`

✅ Inventory Management  
- Manage product quantities  
- Receive low-stock alerts

✅ Sales Tracking  
- Log sales entries  
- Record payment methods  
- View daily sales trends

✅ Data Visualization  
- Category-wise sales pie chart  
- Daily sales line chart  
- Payment method share donut chart

---

## 🛠 Tech Stack

- **Frontend**: React, Tailwind CSS, Framer Motion, Recharts
- **Backend**: Express.js, Node.js
- **Database**: MongoDB
- **Auth**: Firebase Authentication, JSON Web Tokens
- **Charts**: Recharts

---

## 📂 Project Structure
- /frontend → React frontend
- /backend → Express backend
- /backend/models → Mongoose schemas
- /backend/routes → Express API routes

## 🔒 Environment Variables

Create a `.env` file in `/backend` with:
- MONGO_URI=mongodb://localhost:27017/your_db
- JWT_SECRET=your_jwt_secret
- FIREBASE_SERVICE_ACCOUNT=path/to/serviceAccount.json


---

## ⬇️ Installation

Clone the repo:

git clone https://github.com/HaRdIKGaR/Inventory_Manager.git

### Backend
- cd server
- npm install
- node server.js

### Frontend
- cd frontend
- npm install
- npm run dev


---

## 🔑 User Roles

- **admin** → Admin dashboard
- **cashier** → Sales dashboard
- **inventoryManager** → Inventory dashboard

Upon login, users are redirected automatically to the route matching their role.

---

## 📊 Charts

### Category-wise Sales

Shows product-wise breakdown of sales for a selected category:

- Quantity sold
- Revenue generated

### Daily Sales Trend

Displays daily sales:

- Quantity trend
- Revenue trend

### Payment Methods Share

Displays share of sales revenue among payment methods in a donut chart.

---

## 📦 API Endpoints

- **POST /api/login** → User login
- **POST /api/register** → User registration
- **POST /api/google-login** → Google auth login
- **GET /api/sales/category/:category** → Category-wise sales data
- **GET /api/sales/daily** → Daily sales data
- **GET /api/sales/payment-methods** → Payment methods share

---




## 🙌 Contributing

PRs welcome! Please open an issue for discussion before significant changes.

---


