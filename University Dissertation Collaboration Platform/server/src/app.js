const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require("fs");

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require("./api/authRoutes");
const studentRoutes = require("./api/studentRoutes");
const professorRoutes = require("./api/profesorRoutes");
const thesisRoutes = require("./api/lucrareRoutes");

// Import database connection
const pool = require("./config/db");
const DB_Init = require("./database/DB_Init.JS");

// Create Express app
const app = express();

// Configure upload paths
const uploadsPath = path.join(__dirname, "../uploads"); // Stay inside the server directory
const tezeUploadPath = path.join(uploadsPath, "teze");
const publicPath = path.join(__dirname, "public");

// Create necessary directories if they don't exist
[uploadsPath, tezeUploadPath].forEach((dir) => {
  console.log(`Checking directory: ${dir}`);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log("Created directory:", dir);
  }
});

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

// Additional CORS headers
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

app.options("*", cors());

// Request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 100 requests per windowMs
});
app.use("/api/", limiter);

// Static file serving for teze folder
app.use(
  "/uploads/teze",
  express.static(tezeUploadPath, {
    setHeaders: (res, path) => {
      res.set("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

// Static files serving for the public folder
app.use(express.static(publicPath));

// File upload middleware
app.use(
  fileUpload({
    createParentPath: true,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    abortOnLimit: true,
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/professors", professorRoutes);
app.use("/api/thesis", thesisRoutes);

// 404 Error handler
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// Initialize database
DB_Init();

// Database connection test
const testConnection = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log("Database connection successful");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  } finally {
    if (connection) connection.release();
  }
};

// Graceful shutdown handler
const gracefulShutdown = async () => {
  console.log("Received shutdown signal");
  try {
    await pool.end();
    console.log("Database connections closed");
    process.exit(0);
  } catch (error) {
    console.error("Error during graceful shutdown:", error);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  try {
    await testConnection();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(
        `Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Error handling for uncaught exceptions and unhandled rejections
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  gracefulShutdown();
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
  gracefulShutdown();
});

// Graceful shutdown signals
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

// Start the server
if (require.main === module) {
  startServer();
}

module.exports = app;
