import express from "express";
import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";
import dotenv from "dotenv";
import { connectMongoDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { setupSocket } from "./lib/socket.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

app.use(cookieParser());
app.use(express.json());

// فقط در توسعه CORS فعال باشه
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
}

app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);

setupSocket(server);

if (process.env.NODE_ENV === "production") {
  const projectRoot = path.join(__dirname, "../..");
  const frontendPath = path.join(projectRoot, "frontend", "dist");

  console.log("Serving static files from:", frontendPath);

  app.use(express.static(frontendPath));

  app.get(/.*/, (req, res) => {
    const indexPath = path.join(frontendPath, "index.html");
    res.sendFile(indexPath);
  });
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("Server running on PORT", PORT);
  console.log("NODE_ENV =", process.env.NODE_ENV);
  connectMongoDB();
});
