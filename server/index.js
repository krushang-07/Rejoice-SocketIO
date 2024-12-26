import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const PORT = 3000;
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors());

app.get("/", (req, res) => {
  res.send("hello from server");
});

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  //server emit the message to the client
  //socket.emit("welcome12", "welcome to the server");

  //when user connected than other socket has send the message of new user connect (the message that not send to connected user that message send to other all the user by broadcasting)
  //socket.broadcast.emit("welcome12", `${socket.id} joined the server.`);

  socket.on("message", ({ room, message }) => {
    // console.log(data);

    //emmited data recived from the client site and that data broadcast to socket other than current user
    // socket.broadcast.emit("rec-message", data);
    console.log({ room, message });
    socket.to(room).emit("rec-message", message);
  });

  //   socket.on("join-room", (room) => {
  //     socket.join(room);
  //     console.log(`User joined room ${room}`);
  //   });

  socket.on("join-room", (room) => {
    if (room && room.trim() !== "") {
      socket.join(room);
      console.log(`User joined room: ${room}`);
    } else {
      console.log("Invalid room name");
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server connected at ${PORT}`);
});
