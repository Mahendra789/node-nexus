## NodeNexus

A full‑stack project featuring an Express.js + MongoDB backend and a React frontend dashboard. It provides user authentication (JWT), product analytics (stats, charts), and paginated supplier/category views.

- **Purpose**: Demonstrate a production‑like full‑stack starter with clean API boundaries, auth, charts, and a responsive UI.
- **Key features**:
  - **Auth**: Signup, login (JWT, 2h expiry), protected routes via `Authorization: Bearer <token>`.
  - **Products**: Paginated listing and deletion by Mongo `_id` or numeric `id`.
  - **Analytics**: Totals, month‑wise sales/orders, and top suppliers/categories.
  - **Tech**: Express 5, Mongoose 8, React 18, CRA 5, Bootstrap 4.

## Prerequisites

- **Node.js**: v18+ recommended
- **npm**: v9+ (bundled with Node)
- **MongoDB**: an instance/cluster and a database; connection string for `MONGODB_URI`

## Installation

1. Clone the repository

   ```bash
   git clone https://github.com/Mahendra789/node-nexus
   cd NodeNexus
   ```

2. Install backend dependencies

   ```bash
   cd backend
   npm install
   ```

3. Configure backend environment

   Create `backend/.env` with:

   ```bash
   # backend/.env
   MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
   JWT_SECRET_KEY=replace-with-a-long-random-string
   PORT=8080
   ```

4. Install frontend dependencies

   ```bash
   cd ../frontend
   npm install
   ```

5. (Optional) Configure frontend API base URL

   Create `frontend/.env` if you want to override the default `http://localhost:8080` in development:

   ```bash
   # frontend/.env
   REACT_APP_API_BASE_URL=http://localhost:8080
   ```

## Running the project

### Development

Run backend and frontend in separate terminals.

- Backend (Express):

  ```bash
  cd backend
  npm run dev
  # nodemon will start on PORT from .env (default 8080)
  ```

- Frontend (React):

  ```bash
  cd frontend
  npm start
  # CRA dev server on http://localhost:3000
  ```

Notes:

- CORS is enabled to `*` by default in `backend/index.js` so the frontend can call the API during development.
- Frontend reads `API_BASE_URL` from `frontend/src/config.js` using `REACT_APP_API_BASE_URL` or falls back to `http://localhost:8080` when not in production.

### Production

- Backend (Express):

  ```bash
  cd backend
  npm start
  # Ensure MONGODB_URI and JWT_SECRET_KEY are set in the environment
  ```

- Frontend (React):

  ```bash
  cd frontend
  npm run build
  # Serve build/ with your preferred static host (e.g., nginx, Netlify, Vercel) or:
  npx serve -s build -l 3000
  ```

Typical deployment pairs the static frontend with the backend accessible at the same domain or via a reverse proxy. Set `REACT_APP_API_BASE_URL` accordingly at build time.

## Backend API

Base URL: `http://localhost:8080`

### Authentication

- POST `/auth/signup`

  - **Description**: Create a user.
  - **Body (JSON)**:
    ```json
    {
      "firstName": "Ada",
      "lastName": "Lovelace",
      "email": "ada@example.com",
      "password": "Secret123!",
      "address": "",
      "city": "",
      "country": "",
      "phone": "",
      "about": ""
    }
    ```
  - **Response 201**:
    ```json
    { "message": "User created!", "userId": "<mongoObjectId>" }
    ```

- POST `/auth/login`

  - **Description**: Authenticate and receive a JWT (2h expiry).
  - **Body (JSON)**:
    ```json
    { "email": "ada@example.com", "password": "Secret123!" }
    ```
  - **Response 200**:
    ```json
    { "token": "<jwt>", "userId": "<mongoObjectId>" }
    ```

- GET `/auth/user` (protected)

  - **Description**: Get all users.
  - **Headers**: `Authorization: Bearer <jwt>`
  - **Response 200**: Array of users (password excluded).

- PUT `/auth/user/:userId` (protected)
  - **Description**: Update a user by id.
  - **Headers**: `Authorization: Bearer <jwt>`
  - **Body**: Any subset of user fields (`firstName`, `lastName`, `address`, etc.).
  - **Response 200**:
    ```json
    {
      "message": "User updated successfully",
      "user": {
        /* updated user */
      }
    }
    ```

### Products and Analytics (protected)

All endpoints below require `Authorization: Bearer <jwt>`.

- GET `/product/all`

  - **Query**: `page` (default 1), `limit` (default 10)
  - **Description**: Paginated products; returns an array of product documents for the requested page.

- DELETE `/product/:productId`

  - **Description**: Delete by Mongo `_id` or numeric `id`.
  - **Response 200**: `{ "message": "Deleted product." }`

- GET `/product/stats`

  - **Description**: Aggregate totals.
  - **Response 200 (example)**:
    ```json
    {
      "total_product": 1234,
      "total_categories": 12,
      "total_orders": 1234,
      "total_sales": 987654
    }
    ```

- GET `/product/sales-and-orders`

  - **Description**: Month‑wise aggregation for a fixed Jan–Jun window.
  - **Response 200 (shape)**:
    ```json
    {
      "Jan": { "totalOrders": 10, "totalQuantity": 120, "totalSales": 4500 },
      "Feb": { "totalOrders": 8, "totalQuantity": 90, "totalSales": 3800 }
    }
    ```

- GET `/product/suppliers-and-categories`

  - **Description**: Top 5 suppliers and categories (rounded values).
  - **Response 200 (example)**:
    ```json
    {
      "Supplier data": [
        { "Name": "ACME", "Quantity": 200, "Unit": 25, "Price": 5000 }
      ],
      "Category data": [
        { "Category name": "Electronics", "Quantity": 320, "Price": 12000 }
      ]
    }
    ```

- GET `/product/suppliers`

  - **Query**: `page` (default 1), `limit` (default 10)
  - **Description**: Paginated supplier aggregates.
  - **Response 200 (shape)**:
    ```json
    {
      "items": [{ "Name": "ACME", "Quantity": 200, "Unit": 25, "Price": 5000 }],
      "page": 1,
      "limit": 10,
      "total": 42,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    }
    ```

- GET `/product/categories`
  - **Query**: `page` (default 1), `limit` (default 10)
  - **Description**: Paginated category aggregates.
  - **Response 200**: Same shape as `/product/suppliers`.

### Authentication details

- Send `Authorization: Bearer <token>` for all protected routes.
- `JWT_SECRET_KEY` must be configured on the backend. Tokens expire in 2 hours.

## Data models (simplified)

- `User` (`backend/models/user.js`): `firstName`, `lastName`, `email` (unique, lowercase), `password` (hashed, not selected), plus profile fields.
- `Product` (`backend/models/product.js`): `id` (Number), `product_name`, `category`, `quantity`, `unit_price`, `total_price`, `date_ordered` (String), `supplier`, `about`, `customer_name`, `customer_email`.

## Project structure (high‑level)

- Backend: `backend/`
  - Entry: `backend/index.js`
  - Routes: `backend/routes/auth.js`, `backend/routes/product.js`
  - Controllers: `backend/controllers/auth.js`, `backend/controllers/product.js`
  - Models: `backend/models/user.js`, `backend/models/product.js`
  - Config: `backend/config/db.js` (uses `MONGODB_URI`)
  - Middleware: `backend/middleware/is-auth.js`
- Frontend: `frontend/`
  - Entry: `frontend/src/index.js`
  - API utility: `frontend/src/api/apiRequest.js`
  - Config: `frontend/src/config.js`
  - Views/Layouts/Components under `frontend/src/`

## Available scripts

- Backend (`backend/package.json`):
  - `npm run dev`: start with nodemon
  - `npm start`: start with node
- Frontend (`frontend/package.json`):
  - `npm start`: CRA dev server
  - `npm run build`: production build (honors `PUBLIC_URL` and `REACT_APP_*`)
  - `npm run build:scss`: compile and minify theme SCSS

## Configuration notes

- Ensure `MONGODB_URI` and `JWT_SECRET_KEY` are set for the backend to boot.
- Backend default port is `8080` (can be overridden by `PORT`).
- Frontend resolves `API_BASE_URL` from `REACT_APP_API_BASE_URL` in `.env`. In production builds, set it at build time.
- CORS is permissive (`*`) by default for development convenience.

## Demo

Placeholder: [Live Demo](https://example.com) — update with an actual deployment link when available.

## License

Add your preferred license here (e.g., MIT).
