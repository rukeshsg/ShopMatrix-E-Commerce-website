<<<<<<< HEAD
# ShopMatrix 💎

ShopMatrix is a premium, full-stack luxury e-commerce platform designed to provide a seamless and elegant shopping experience. Built with the **MERN Stack**, it features a sophisticated UI, secure authentication, and robust product management.

---

## 🔗 Links

### 🔗 Live Demo
<!-- Placeholder for Live Demo Link -->


### 🎥 Demo Video
<!-- Placeholder for Demo Video Link -->


### 📸 Screenshots
<!-- Placeholder for Screenshots -->


---

## ✨ Features

-   🔐 **Secure Authentication**: JWT-based auth with HttpOnly cookies, access/refresh token rotation, and secure password hashing.
-   🛍️ **Dynamic Catalog**: Real-time product search, category filtering (Electronics, Fashion, Home & Garden, etc.), and detailed product views.
-   👤 **User Dashboard**: Comprehensive settings for profile management, security (password change), and order history.
-   🛒 **Shopping Experience**: Fully functional cart system with optimistic UI updates.
-   🎨 **Premium UI/UX**: Modern, responsive design with support for Light and Dark modes, custom SVG branding, and smooth animations.
-   📧 **Email Integration**: Automated email notifications for account activities using Nodemailer.

---

## 🚀 Tech Stack

**Frontend:**
-   [React.js](https://reactjs.org/) (Vite)
-   [Zustand](https://github.com/pmndrs/zustand) (State Management)
-   [React Router](https://reactrouter.com/)
-   [Axios](https://axios-http.com/)
-   [Lucide React](https://lucide.dev/) (Icons)
-   [Sonner](https://sonner.emilkowal.ski/) (Toasts)

**Backend:**
-   [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
-   [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
-   [JSON Web Token](https://jwt.io/) (Authentication)
-   [Nodemailer](https://nodemailer.com/) (Email Service)
-   [Helmet](https://helmetjs.github.io/) & [Rate Limit](https://www.npmjs.com/package/express-rate-limit) (Security)

---

## 📁 Project Structure

```text
shopmatrix-fullstack/
├── backend/                # Express API, MongoDB models, controllers
│   ├── config/             # Database & global configs
│   ├── controllers/        # Business logic for routes
│   ├── middleware/         # Auth & error handling
│   ├── models/             # Mongoose schemas
│   └── routes/             # API endpoints
├── frontend/               # React application (Vite)
│   ├── src/
│   │   ├── api/            # Axios instance & interceptors
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Full page views
│   │   ├── store/          # Zustand state management
│   │   └── utils/          # Helper functions
└── package.json            # Root configuration for workspace
```

---

## 🛠️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/shopmatrix.git
cd shopmatrix
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder based on `.env.example`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
SMTP_EMAIL=your_email
SMTP_PASSWORD=your_app_password
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend` folder:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🏃 Usage

### Run in Development
From the root directory:
```bash
npm run dev
```
This will start both the backend server (port 5000) and the frontend (port 5173) concurrently.

### Seed Database
To populate the database with initial products:
```bash
npm run seed
```

---

## 📡 API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate user & get token |
| `GET` | `/api/products` | Fetch all products (with search/filter) |
| `GET` | `/api/products/:id` | Get detailed product info |
| `PUT` | `/api/users/profile` | Update user profile (Protected) |

---

## 🚧 Future Improvements
-   [ ] Stripe/Razorpay Payment Integration
-   [ ] Admin Dashboard for Product Management
-   [ ] Order Tracking System
-   [ ] Product Reviews & Ratings

---

Made with ❤️ by [Your Name]
=======
# ShopMatrix-E-Commerce-website-
ShopMatrix is a professional, full-stack luxury e-commerce platform built with the MERN stack. Features include secure JWT authentication, a dynamic product catalog with search/filtering, shopping cart management, user settings dashboard, and a premium, responsive UI/UX.
>>>>>>> ed4edca5dacb877804bf5ea2798109898d616e20
