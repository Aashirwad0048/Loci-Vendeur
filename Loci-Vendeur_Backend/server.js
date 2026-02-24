import express from "express";
import cors from "cors";
import morgan from "morgan";
import env from "./config/env.js";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import escrowRoutes from "./routes/escrowRoutes.js";
import disputeRoutes from "./routes/disputeRoutes.js";
import billRoutes from "./routes/billRoutes.js";
import { startEscrowAutoReleaseJob } from "./services/escrowAutomationService.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://loci-vendeur.vercel.app',
  env.clientUrl
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "OK", data: { timestamp: new Date().toISOString() } });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/escrow", escrowRoutes);
app.use("/api/disputes", disputeRoutes);
app.use("/api/bills", billRoutes);

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  await connectDB();
  startEscrowAutoReleaseJob();
  app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server", error.message);
  process.exit(1);
});
