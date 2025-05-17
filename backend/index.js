require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user");


const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);

// Veritabanı bağlantısını başlat
connectDB();

// Test endpointi
app.get("/api/ping", (req, res) => {
  res.json({ message: "API çalışıyor." });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor.`);
});
