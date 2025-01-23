import app from "./app";
import http from "http";

const startServer = async () => {
  const server = http.createServer(app);
  server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
};

startServer();
