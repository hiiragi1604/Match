import app from "./app";
import { connectToDatabase, closeDatabaseConnection } from "./database";

const PORT = process.env.PORT || 6969;

const startServer = async () => {
  try {
    await connectToDatabase();
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    server.on("error", (error) => {
      console.error("Failed to start server:", error.message, error.stack);
    });

    const gracefulShutdown = async () => {
      console.log("Shutting down gracefully...");
      await closeDatabaseConnection();
      server.close((err) => {
        if (err) {
          console.error("Error closing server:", err);
          process.exit(1);
        }
        process.exit(0);
      });
    };

    process.on("SIGINT", gracefulShutdown);
    process.on("SIGTERM", gracefulShutdown);
  } catch (error) {
    console.error(
      "Failed to start server:",
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  }
};

startServer();
