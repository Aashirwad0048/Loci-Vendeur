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
