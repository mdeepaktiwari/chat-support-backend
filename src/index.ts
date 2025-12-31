import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { chatRouter } from "./routes/chatRoutes.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import { rateLimiter } from "./middleware/rateLimiter.js";
import { connection } from "./database/pool.js";

dotenv.config();

const createApp = (): Application => {
  const app = express();

  // CORS
  app.use(
    cors({
      origin: "*",
      credentials: true,
      methods: ["GET", "POST", "OPTIONS"],
    })
  );

  // parser
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  // rate limiting
  app.use("/api/chat", rateLimiter);

  // routes
  app.use("/api/chat", chatRouter());

  // 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: "Route not found",
    });
  });

  // Error handling
  app.use(errorMiddleware);

  return app;
};

const startServer = async (): Promise<void> => {
  try {
    const port = parseInt(process.env.PORT || "8000");

    const dbConnected = await connection();

    if (!dbConnected) throw new Error("Failed to connect to database");

    const app = createApp();

    app.listen(port, () => {
      console.log(`Server started on PORT: ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
