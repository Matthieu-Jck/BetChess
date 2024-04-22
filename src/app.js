import express from "express";
import path from "path";
import cors from "cors";
import http from "http";
import wsChess from "./ws-chess.js";

const __dirname = path.resolve();
const PORT = process.env.PORT || 10000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/public', express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  console.log("Serving index.html");
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use("/api", (_req, res) => {
  console.log("API request to /api");
  res.send({ text: "Hello World" });
});

const server = http.createServer(app);
server.listen(PORT, () => console.log(`Application started on port ${PORT}`));

wsChess(server);