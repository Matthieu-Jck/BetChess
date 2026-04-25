// Importing modules
import express from "express";
import path from "path";
import cors from "cors";
import { createServer } from "http";
import socketServer from "./socketServer.js";
import { config } from "dotenv";

// Configuring dotenv
config();

// Constants and initializations
const __dirname = path.resolve();
const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.PORT || 10000;
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use('/public', express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  console.log("Serving index.html");
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get("/healthz", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use("/api", (_req, res) => {
  res.send({ text: "Hello World" });
});

// Server setup
const server = createServer(app);
server.listen(PORT, HOST, () => console.log(`Application started on http://${HOST}:${PORT}`));

// WebSocket setup
socketServer(server);
