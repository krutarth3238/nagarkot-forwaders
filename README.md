# Nagarkot Forwarders Dashboard

A next-generation logistics and freight tracking platform designed for extreme clarity and operational efficiency. The platform allows logistics administrators and customers to track global intermodal consignments, update operational statuses, and view immutable cryptographic audit logs for every shipment event.

## Tech Choices and Why

* **Frontend:** React with Vite. React provides a robust component-based architecture for building the interactive dashboard and modal views, while Vite offers incredibly fast Hot Module Replacement (HMR) and optimized builds.
* **Styling:** Tailwind CSS. We opted for Tailwind to rapidly construct the modern, glassmorphic UI. Its utility-first approach made it incredibly simple to implement complex visual layers (like `backdrop-blur` and ambient glows) without managing massive CSS stylesheets. 
* **Backend:** Node.js with Express & TypeScript. A lightweight, non-blocking environment ideal for the I/O-heavy nature of fetching telemetry data and handling concurrent status updates. TypeScript enforces strict types for the API responses, ensuring the frontend always receives the expected payload shapes.
* **Database:** PostgreSQL. Chosen for its relational integrity and robust performance. Consignments strictly map to their historical audit logs using foreign keys, making Postgres the perfect fit for maintaining the integrity of our shipment history.

## Steps to Run Locally

### 1. Database Setup
Ensure you have PostgreSQL installed and running locally on port 5432 with default credentials (postgres/postgres), or update the `DATABASE_URL` in `.env`.
To structure the tables and seed the demo data:
```bash
cd node-backend
npm run db:init
```

### 2. Run the Backend
```bash
cd node-backend
npm install
npm run dev
```
The backend will run on `http://localhost:5000`.

### 3. Run the Frontend
In a new terminal window:
```bash
cd fontend
npm install
npm run dev
```
The application will be accessible at `http://localhost:3000`. 
*(Note: Login with `admin@nagarkot.com` / `123456` to access the admin dashboard).*

## Assumptions Made

* **Data Model:** We assumed a one-to-many relationship between `shipments` and `shipment_history`. The `shipments` table maintains the *current* state (for fast dashboard querying/filtering), while `shipment_history` serves as an append-only ledger for the Audit Trail.
* **Status Flow:** We assumed that operational statuses (e.g., 'Booked' -> 'In Transit' -> 'Delivered') can be updated sequentially by administrators. Any status update (including Exceptions/Customs Holds) immediately triggers a timestamped event in the history log to ensure absolute transparency.
* **Authentication:** We assumed the current scope primarily focuses on the dashboard visualization; thus, the frontend routing handles basic auth gating for the demo.

## Scaling for the Future

**If this needed to support 10,000 shipments and multiple concurrent users, what would you change?**
To support heavy concurrent usage and a massive dataset, we would introduce server-side pagination and indexing on the Postgres `shipments` table (specifically on `status` and `mode` columns) to prevent the API from fetching the entire dataset into memory. For real-time telemetry updates across multiple users, we would implement WebSockets (e.g., Socket.io) instead of relying on frontend polling or manual refreshes, ensuring all connected dashboards instantly reflect status changes. Additionally, we would introduce a caching layer (like Redis) for the KPI aggregations, as calculating active metrics over 10,000+ rows per request would quickly become a significant database bottleneck.
