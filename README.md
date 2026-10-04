# Next.js Tailwind E-Commerce Website Like Amazon

An Amazon-style online store built with Next.js, Tailwind CSS and MongoDB. Customers can browse products, manage a cart, check out and pay with PayPal. Admins get a dashboard for sales, orders, products and users.

## Demo

[Demo site](https://next-tailwind-amazona-one.vercel.app/)

Account:

- login: `john.doe@example.com`
- password: `123456`

## Features

- Product list and product details pages
- Shopping cart saved in a cookie
- Sign up, sign in and profile editing (NextAuth credentials provider)
- Checkout wizard: shipping address, payment method, place order
- PayPal payments, verified on the server
- Order history
- Admin dashboard with a sales chart
- Admin management of orders (mark as delivered), products (with Cloudinary image upload) and users

## Tech stack

- [Next.js 12](https://nextjs.org/) (pages router, API routes)
- [Tailwind CSS](https://tailwindcss.com/) and [Headless UI](https://headlessui.com/)
- [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [PayPal JS SDK](https://github.com/paypal/react-paypal-js)
- [Cloudinary](https://cloudinary.com/) for image uploads
- [Chart.js](https://www.chartjs.org/) for the admin dashboard

## Getting Started

### Prerequisites

- Node.js 16 or later
- A MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A PayPal developer account (for payments) and a Cloudinary account (for image upload)

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.sample` to `.env` and fill in the values:

   | Variable | Description |
   |---|---|
   | `NEXTAUTH_URL` | Public URL of the site, e.g. `http://localhost:3000` |
   | `NEXTAUTH_SECRET` | Random string used to sign session tokens |
   | `MONGODB_URI` | MongoDB connection string |
   | `PAYPAL_CLIENT_ID` | PayPal REST app client ID |
   | `PAYPAL_CLIENT_SECRET` | PayPal REST app secret, used to verify payments on the server |
   | `PAYPAL_API_URL` | `https://api-m.sandbox.paypal.com` (default) or `https://api-m.paypal.com` for live payments |
   | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
   | `NEXT_PUBLIC_CLOUDINARY_API_KEY` | Cloudinary API key |
   | `CLOUDINARY_SECRET` | Cloudinary API secret, used to sign uploads |

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Seed the database with sample users and products by opening [http://localhost:3000/api/seed](http://localhost:3000/api/seed). This **deletes all existing users and products**. In production, only a signed-in admin can run it.

5. Open [http://localhost:3000](http://localhost:3000) and sign in with the demo account above.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm start` | Start the production server |

## Deployment

The app uses API routes and server-side rendering, so it needs a Node.js host such as [Vercel](https://vercel.com/). It can't be deployed as a static export (for example to GitHub Pages). Set the environment variables above in your hosting provider.

## Project structure

```
components/   Shared React components (layout, checkout wizard, chart)
models/       Mongoose models: User, Product, Order
pages/        Pages and API routes (pages/api)
pages/admin/  Admin dashboard pages
styles/       Global Tailwind styles
utils/        Database connection, cart store, pricing, PayPal helpers, seed data
```

## Lessons

1. Introduction
2. Install Tools
3. Create Next App
4. Publish to Github
5. Create Website Layout
   1. create layout component
   2. add header
   3. add main section
   4. add footer
   5. add tailwind classes
