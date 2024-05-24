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

app.use("/api", (_req, res) => {
  res.send({ text: "Hello World" });
});

// Server setup
const server = createServer(app);
server.listen(PORT, () => console.log(`Application started on port ${PORT}`));

// WebSocket setup
socketServer(server);