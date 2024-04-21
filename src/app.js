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

// Serve static files from the public directory
app.use('/public', express.static(path.join(__dirname, 'public')));

// Main route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use("/api", (_req, res) => res.send({ text: "Hello World" }));

const server = http.createServer(app);
server.listen(PORT, () => console.log(`Application started on port ${PORT}`));

// WebSocket setup for chess game
wsChess(server);