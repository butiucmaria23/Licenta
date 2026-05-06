<div align="center">

# 🌍 Pack&Go

### Tourist Package Booking Platform

A modern web application for browsing, reserving and managing tourist packages, developed as part of a bachelor's thesis project.

[Live Demo](https://pack-and-go-csie.vercel.app)

</div>

---

## About the Project

**Pack&Go** is a web platform designed to digitalize the process of searching, booking and managing tourist packages.

The application allows users to explore available travel offers, view package details, create reservations, complete a demo payment flow and manage their booking history. The project simulates the main functionalities of a real online tourism booking platform, from package discovery to reservation confirmation.

The platform was developed as a bachelor's thesis project and focuses on creating a complete, user-friendly and realistic digital solution for tourist package management.

---

## Main Features

- User registration and login
- Secure authentication using JWT
- Password hashing with bcrypt
- Tourist package browsing
- Search and filtering for packages
- Detailed package pages
- Reservation system
- Reservation status management
- Demo online payment using Stripe Checkout
- Payment confirmation through Stripe Webhooks
- Payment cancellation flow
- User reservation history
- Review system
- Admin area for platform management
- Responsive web interface
- Deployment on Vercel

---

## Technologies Used

| Category | Technologies |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Styling | Tailwind CSS |
| Backend | Next.js API Routes |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JWT, bcryptjs |
| Payments | Stripe Checkout, Stripe Webhooks |
| Deployment | Vercel |

---

## Application Modules

### Authentication Module

The authentication module allows users to create an account and log into the platform. Passwords are securely hashed, and protected actions are available only to authenticated users.

---

### Tourist Packages Module

Users can browse available tourist packages, view detailed information and filter offers based on their preferences.

Each package can include information such as:

- destination
- description
- price
- start date
- end date
- available slots
- image
- travel details

---

### Reservation Module

The reservation module allows authenticated users to reserve a tourist package for a selected number of people.

A reservation is not confirmed instantly. It first receives the status:

```text
PENDING_PAYMENT
```

After a successful demo payment, the reservation becomes:

```text
CONFIRMED
```

If the payment is cancelled, the reservation can become:

```text
CANCELLED
```

---

### Payment Module

The payment module uses **Stripe Checkout in Test Mode**.

This feature is implemented only for demonstration purposes. No real money is charged, and the application does not store card details.

The general payment flow is:

```text
User selects a tourist package
        ↓
User clicks Pay and Reserve
        ↓
Reservation is created as PENDING_PAYMENT
        ↓
User is redirected to Stripe Checkout
        ↓
Stripe processes the test payment
        ↓
Stripe sends a webhook event
        ↓
Reservation becomes CONFIRMED
```

Main payment routes:

```text
POST /api/payments/create-checkout-session
POST /api/payments/webhook
POST /api/payments/cancel
```

---

### Review Module

Users can leave reviews for tourist packages, helping improve transparency and trust within the platform.

---

### Admin Module

The admin area provides management functionalities for the platform, supporting the organization and administration of tourist packages and user activity.

---

## Database Structure

The application uses **PostgreSQL** together with **Prisma ORM**.

Main database models:

```text
User
Package
Reservation
Payment
Review
```

Main reservation statuses:

```text
PENDING_PAYMENT
CONFIRMED
CANCELLED
PAYMENT_FAILED
```

Main payment statuses:

```text
PENDING
PAID
FAILED
```

The `Reservation` and `Payment` models are connected so that the platform can track the payment status of each reservation.

---

## Stripe Test Payment

The payment system works in **Stripe Test Mode**.

For testing a successful payment, use the following test card:

```text
Card number: 4242 4242 4242 4242
Expiration date: Any future date
CVC: Any 3 digits
ZIP: Any value
```

No real transaction is performed.

---

## Environment Variables

Create a `.env.local` file in the root folder of the project.

```env
DATABASE_URL="your_postgresql_connection_string"

JWT_SECRET="your_jwt_secret"

STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_stripe_webhook_secret"

NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

For production deployment, use:

```env
NEXT_PUBLIC_APP_URL="https://pack-and-go-csie.vercel.app"
```

Important:

```text
Do not commit real environment variables to GitHub.
Do not expose Stripe secret keys publicly.
Do not store card details in the application database.
```

---

## Local Installation

Clone the repository:

```bash
git clone https://github.com/butiucmaria23/Licenta.git
```

Go to the project folder:

```bash
cd Licenta
```

Install dependencies:

```bash
npm install
```

Generate Prisma Client:

```bash
npx prisma generate
```

Push the Prisma schema to the database:

```bash
npx prisma db push
```

Optional: seed the database:

```bash
npx prisma db seed
```

Start the development server:

```bash
npm run dev
```

Open the application:

```text
http://localhost:3000
```

---

## Stripe Webhook Setup

For local webhook testing, install and use Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/payments/webhook
```

The generated webhook signing secret must be added to:

```env
STRIPE_WEBHOOK_SECRET="whsec_..."
```

For production, the Stripe webhook endpoint should be:

```text
https://pack-and-go-csie.vercel.app/api/payments/webhook
```

Required Stripe event:

```text
checkout.session.completed
```

---

## Available Scripts

Start the development server:

```bash
npm run dev
```

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

Run linting:

```bash
npm run lint
```

Generate Prisma Client:

```bash
npm run postinstall
```

---

## Deployment

The application is deployed using **Vercel**.

Before deployment, the following environment variables must be configured in the Vercel project settings:

```env
DATABASE_URL
JWT_SECRET
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_APP_URL
```

After adding or changing environment variables, the project must be redeployed.

---

## Academic Context

Pack&Go was developed as a bachelor's thesis project.

The goal of the project is to demonstrate the analysis, design, implementation and testing of a digital platform for managing tourist packages, online reservations and payment-based confirmation.

The payment module is implemented as a demo feature using Stripe Test Mode, in order to simulate the behavior of a real booking platform without processing real financial transactions.

---

## Author

Developed by **Butiuc Maria Antonia**.

---

## License

This project is intended for academic use.
