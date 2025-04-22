const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// ✅ Set view engine
app.set("view engine", "ejs");

// ✅ Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, "public"))); // Correct method to serve static

// ✅ Socket.IO connection
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // 📍 Receive location from client and broadcast to all
  socket.on("send-location", (data) => {
    io.emit("receive-location", {
      id: socket.id,
      ...data,
    });
  });

  // ❌ Handle disconnection
  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
    io.emit("user-disconnected", socket.id);
  });
});

// ✅ Route for main page
app.get("/", (req, res) => {
  res.render("index");
});

// ✅ Start server
const PORT = 8000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
