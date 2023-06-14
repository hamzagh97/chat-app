const express = require("express");
const port = 5000;
const app = express();

const io = require("socket.io")(port, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

io.on("connection", (socket) => {
  // socket.on("register", (id) => {
  //   users.push(socket.id);
  // });

  socket.on("send-message", (message) => {
    socket.broadcast.emit("recieve-message", {
      message: message,
      user: socket.id,
      type: "text",
    });
  });

  socket.on("send-voice", (voice) => {
    socket.broadcast.emit("recieve-voice", {
      message: voice,
      user: socket.id,
      type: "voice",
    });
  });
});
