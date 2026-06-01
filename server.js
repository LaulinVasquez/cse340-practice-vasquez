import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { caCert } from "./src/models/db.js";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { setupDatabase, testConnection } from "./src/models/setup.js";

// Import MVC components
import routes from "./src/controllers/routes.js";
import { addLocalVariables } from "./src/middleware/global.js";

// server configuration:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production"; // set the environment from .env file or default to development
const PORT = process.env.PORT || 3000; // set the port from .env file or default to 3000

// app = express() creates an instance for the application
const app = express();

// Initialize PostgreSQL session store
const pgSession = connectPgSimple(session);

// Configure session middleware
app.use(
  session({
    store: new pgSession({
      conObject: {
        connectionString: process.env.DB_URL,
        // Configure SSL for session store connection (required by BYU-I databases)
        ssl: {
          ca: caCert,
          rejectUnauthorized: true,
          checkServerIdentity: () => {
            return undefined;
          },
        },
      },
      tableName: "session",
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: NODE_ENV.includes("dev") !== true,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

// Configure Express
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs"); // set the view engine to ejs
app.set("views", path.join(__dirname, "src/views")); // Tell Express where to find your templates

// global middleware
app.use(addLocalVariables);

// setting up parse url-encoded ( Allow Express to receive and process POST data)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use("/", routes);

// Global error handling middleware for 404 and other errors
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Global error handling for 404s and 500s
app.use((err, req, res, next) => {
  // Prevent infinite loop if headers are already sent
  if (res.headerSent || res.finished) {
    return next(err);
  }

  // Determine the states code and template
  const status = err.status || 500;
  const message = status === 404 ? "404" : "500";
  const context = {
    title: status === 404 ? "Page Not Found" : "Internal Server Error",
    error: NODE_ENV === "production" ? "An error occured" : err.message, // Show error details only in development
    stack: NODE_ENV === "production" ? null : err.stack,
    NODE_ENV, // Our Websocket check needs this and its convenient to pass along
  };
  // Render the appropriate error template with fallback
  try {
    res.status(status).render(`errors/${message}`, context);
  } catch (renderErr) {
    // If rendering fails, send a simple text response
    if (!res.headerSent) {
      res
        .status(status)
        .send(`<h1>Error ${status}</h1><p>An error occurred.</p>`);
    }
  }
});

if (NODE_ENV.includes("dev")) {
  const ws = await import("ws");
  try {
    const wsPort = parseInt(PORT) + 1;
    const wsServer = new ws.WebSocketServer({ port: wsPort });
    wsServer.on("listening", () => {
      console.log(`WebSocket server is running on port ${wsPort}`);
    });
    wsServer.on("error", (error) => {
      console.error("WebSocket server error:", error);
    });
  } catch (error) {
    console.error("Failed to start WebSocket server:", error);
  }
}

// Start the server and listen on the defined port
app.listen(PORT, async () => {
  await setupDatabase();
  await testConnection();
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
