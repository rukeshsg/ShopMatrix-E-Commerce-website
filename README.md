
# 🛒 ShopMatrix – Premium E-Commerce Platform

![React](https://img.shields.io/badge/Frontend-React-black?style=for-the-badge&logo=react)
![Node](https://img.shields.io/badge/Backend-Node.js-black?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-black?style=for-the-badge&logo=mongodb)
![JWT](https://img.shields.io/badge/Auth-JWT-black?style=for-the-badge&logo=jsonwebtokens)
![Zustand](https://img.shields.io/badge/State-Zustand-black?style=for-the-badge)
![CSS](https://img.shields.io/badge/UI-CSS3-black?style=for-the-badge&logo=css3)

![MERN](https://img.shields.io/badge/Stack-MERN-DAA520?style=for-the-badge)
![Fullstack](https://img.shields.io/badge/Type-Fullstack-DAA520?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production--Ready-DAA520?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-DAA520?style=for-the-badge)

ShopMatrix is a premium, full-stack luxury e-commerce platform designed to provide a seamless and elegant shopping experience. Built with the **MERN Stack**, it features a sophisticated UI, secure authentication, and a robust administrative system for business management.

---

### 🔗 Live Demo

<p align="center">
  <a href="https://shop-matrix-e-commerce-website.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/Live%20App-ShopMatrix-black?style=for-the-badge&logo=vercel&logoColor=white"/>
  </a>
  <br/><br/>
  <a href="https://shopmatrix-backend.onrender.com/" target="_blank">
    <img src="https://img.shields.io/badge/Backend-API-gold?style=for-the-badge&logo=render&logoColor=black"/>
  </a>
</p>

---

## 📸 Visual Showcase


## 🎥 Demo Video

<div align="center">

<a href="https://raw.githubusercontent.com/rukeshsg/ShopMatrix-E-Commerce-website/main/assets/video.mp4">
  <img src="assets/screenshots/home.png" width="80%" />
</a>

<p><b>▶️ Click image to watch demo</b></p>

</div>

---

### 🏠 Home Page
<div align="center">
  <img src="assets/screenshots/home.png" width="80%" alt="Home Page" />
</div>

### 🎨 Admin Management Dashboard
<div align="center">
  <img src="assets/screenshots/admin.png" width="80%" alt="Admin Dashboard" />
</div>

### 🛒 Shopping Cart & Checkout
<div align="center">
  <img src="assets/screenshots/cart.png" width="40%" alt="Cart" />
  <img src="assets/screenshots/checkout.png" width="40%" alt="Checkout" />
</div>

### ⚙️ User Settings & 📂 Categories
<div align="center">
  <img src="assets/screenshots/settings.png" width="40%" alt="Settings" />
  <img src="assets/screenshots/categories.png" width="40%" alt="Categories" />
</div>


## ✨ Key Features

-   🔐 **Advanced Authentication**: JWT-based auth with HttpOnly cookies, access/refresh token rotation, and multi-layered route protection.
-   🛠️ **Powerful Admin Suite**: Comprehensive dashboard to Add, Edit, and Delete products, track inventory value, and monitor low-stock levels with visual progress bars.
-   🛍️ **Dynamic Shopping**: Real-time product search, category filtering, and an optimistic UI cart system.
-   👤 **Personalized Experience**: User dashboard for profile management, security settings (password updates), and order tracking.
-   🎨 **Luxury UI/UX**: Professional design supporting both **Light & Dark modes**, custom SVG branding, and high-quality local asset serving.
-   📧 **Email Notifications**: Integrated Nodemailer system for account verification and security alerts.

---

## 🚀 Tech Stack

**Frontend:**
-   **React 19** (Vite)
-   **Zustand** (Ultra-fast State Management)
-   **React Router 7**
-   **Lucide React** (Premium Icons)
-   **Sonner** (Modern Toasts)
-   **Axios** (API Interceptors)

**Backend:**
-   **Node.js & Express.js**
-   **MongoDB & Mongoose** (ODM)
-   **Bcrypt.js** (Secure Hashing)
-   **Express Rate Limit & Helmet** (Production Security)
-   **Nodemailer** (Email Services)

---

## 🛠️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/shopmatrix.git
cd shopmatrix
```

### 2. Environment Configuration
Create a `.env` file in the `backend/` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
SMTP_EMAIL=your_email
SMTP_PASSWORD=your_app_password
```

### 3. Quick Start (Concurrently)
From the root directory:
```bash
npm install           # Install root dependencies
npm run install-all   # Install frontend & backend dependencies
npm run seed          # Populate with premium product data
npm run dev           # Start both servers
```

---

## 🔑 Admin Access (Test Account)
To test the administrative features:
-   **Email**: `admin@example.com`
-   **Password**: `password123`

---

## 📡 API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Login & receive secure cookies |
| `GET` | `/api/products` | Search & Filter catalog |
| `POST` | `/api/products` | Create new product (Admin Only) |
| `PUT` | `/api/products/:id` | Edit inventory item (Admin Only) |
| `DELETE` | `/api/products/:id` | Remove product (Admin Only) |

---

Made with ❤️ by [Rukesh S G]
