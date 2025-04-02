import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { testConnection, initDb } from "./db";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('Failed to connect to PostgreSQL database. Check your connection settings.');
      process.exit(1);
    }

    // Initialize database
    const dbInitialized = await initDb();
    if (!dbInitialized) {
      console.warn('Database initialization had issues. Tables may not exist or may be empty.');
      console.log('Attempting to continue startup; you may need to run "npm run db:push" to create schema.');
    } else {
      console.log('Database connected and initialized successfully.');
    }

    // Set up routes
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      console.error("Server error:", err);
    });

    // Setup static file serving for production
    if (process.env.NODE_ENV === "production") {
      app.use(express.static(path.join(__dirname, "../dist/public")));
      app.get("*", (_req, res) => {
        res.sendFile(path.join(__dirname, "../dist/public/index.html"));
      });
    } else {
      // Setup Vite development server
      await setupVite(app, server);
    }

    // ALWAYS serve the app on port 5000
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const PORT = process.env.PORT || 5000;
    server.listen({
      port: PORT,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`serving on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();