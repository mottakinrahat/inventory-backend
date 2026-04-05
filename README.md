# 📦 Inventory Management System - Backend

A robust and scalable Inventory & Order Management System backend built with **Node.js**, **Express**, **TypeScript**, and **Prisma ORM**. This system provides a comprehensive set of features for managing users, products, categories, orders, restock queues, and activity logs.

---

## 🚀 Getting Started Locally

Follow these steps to set up the project on your local machine.

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **PostgreSQL** (Active instance)
- **npm** or **yarn**

### 2. Clone the Repository
```bash
git clone <repository-url>
cd inventory-backend
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Environment Configuration
Create a `.env` file in the root directory and add the following environment variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/inventory_db?schema=public"

# App Port
PORT=5000

# JWT Secrets
JWT_SECRET="your_jwt_secret"
EXPIRES_IN="1d"
REFRESH_TOKEN_SECRET="your_refresh_token_secret"
REFRESH_TOKEN_EXPIRES_IN="30d"

# Password Reset
RESET_PASS_TOKEN="your_reset_token_secret"
RESET_PASS_TOKEN_EXPIRES_IN="1h"
RESET_PASS_LINK="http://localhost:3000/reset-password"

# Frontend URL
FRONTEND_URL="http://localhost:3000"
```

### 5. Database Setup (Prisma)
Generate the Prisma client and push the schema to your database:

```bash
npx prisma generate
npx prisma db push
```

### 6. Run the Project
Start the development server:

```bash
npm run dev
```
The server will be running at `http://localhost:5000`.

---

## 🛠️ API Documentation

All API endpoints are prefixed with `/api`.

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/login` | User login to receive tokens | Public |
| POST | `/refreshToken` | Refresh the access token | Manager/Admin |
| POST | `/change-password` | Change the current password | Manager/Admin |
| POST | `/forgot-password` | Initiate forgot password flow | Manager/Admin |
| POST | `/reset-password` | Reset password using token | Public |

### 👤 User Management (`/api/user`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/` | Create a new user | Public |
| GET | `/` | Get all users | Public |
| GET | `/me` | Get current logged-in user profile | Manager/Admin |
| GET | `/:id` | Get user details by ID | Public |

### 📁 Category Management (`/api/category`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/` | Create a new category | Manager/Admin |
| GET | `/` | Get list of all categories | Public |
| GET | `/:id` | Get category details | Public |
| PATCH | `/:id` | Update category info | Public |
| DELETE | `/:id` | Remove a category | Public |

### 📦 Product Management (`/api/product`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/` | Create a new product | Manager/Admin |
| GET | `/` | Get all products (with filters) | Public |
| GET | `/my-products` | Get products created by current user | Authenticated |
| GET | `/:id` | Get product details | Public |
| PATCH | `/:id` | Update product details | Manager/Admin |
| DELETE | `/:id` | Delete a product | Manager/Admin |

### 🛒 Order Management (`/api/order`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/` | Create a new order | Manager/Admin |
| GET | `/` | List all orders | Public |
| GET | `/my-orders` | Get orders created by current user | Authenticated |
| GET | `/:id` | Get order details | Public |
| PATCH | `/:id` | Update order status | Manager/Admin |

### 🔄 Restock Queue (`/api/restock-queue`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/` | Get items pending restock | Manager/Admin |
| GET | `/:id` | Get specific queue entry | Manager/Admin |
| PATCH | `/:id/restock` | Mark item as restocked | Manager/Admin |
| DELETE | `/:id` | Remove from restock queue | Admin |

### 📜 Activity Log (`/api/activity-log`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/` | View all system activities | Manager/Admin |
| GET | `/:id` | View specific activity log | Manager/Admin |

---

## 🏗️ Tech Stack
- **Framework:** [Express.js](https://expressjs.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **Validation:** [Zod](https://zod.dev/)
- **Authentication:** JWT (Json Web Token) & Bcrypt

---

## 📜 License
This project is licensed under the ISC License.