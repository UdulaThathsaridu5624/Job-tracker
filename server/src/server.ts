import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from "./routes/auth.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import { errorHandler } from './middleware/error.middleware.js';
dotenv.config();

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be set and at least 32 characters");
}

const app = express();
const PORT = process.env.PORT;

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json({ limit: "1mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);

app.use(errorHandler);
app.get('/', (_req, res) => {
  res.send({ message: 'Job Tracker API is running' });
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


