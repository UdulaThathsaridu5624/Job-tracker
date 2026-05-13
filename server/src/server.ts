import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from "./routes/auth.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import { errorHandler } from './middleware/error.middleware.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT ;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);

app.use(errorHandler);
app.get('/', (req, res) => {
  res.send({ message: 'Job Tracker API is running' });
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


