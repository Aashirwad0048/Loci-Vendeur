# Loci-Vendeur Backend

## Setup
1. `npm install`
2. Create `.env` from `.env.example`
3. Run `npm run dev`

## Required Environment Variables
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/locivendeur
JWT_SECRET=supersecretkey123
JWT_EXPIRE=7d
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxx
CLIENT_URL=http://localhost:3000
COMMISSION_RATE=0.03
```

## Password Reset / SMTP
```env
PASSWORD_RESET_CLIENT_URL=http://localhost:3000
BREVO_API_KEY=
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@example.com
SMTP_PASS=your-app-password
MAIL_FROM="Loci Vendeur <no-reply@locivendeur.com>"
MAIL_FALLBACK_TO_CONSOLE=true
```

- In production on Render, prefer `BREVO_API_KEY`. If it is set, the backend will send reset emails through Brevo's API instead of SMTP.
- Use `SMTP_SECURE=true` with port `465`.
- Use `SMTP_SECURE=false` with port `587`.
- `MAIL_FALLBACK_TO_CONSOLE=true` is helpful locally; set it to `false` in production.

## Core Packages
- express
- mongoose
- dotenv
- cors
- jsonwebtoken
- bcryptjs
- razorpay
- express-async-handler
- morgan

## API Base
- `http://localhost:5000`
