let express = require("express");
let http = require("http");
let app = express();
let server = http.createServer(app);
let io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["*"],
  },
});

const users = {};
const socketToRoom = {};

const maxUsers = 2;

io.on("connection", (socket) => {
  socket.on("join_room", (data) => {
    if (users[data.room]) {
      const length = users[data.room].length;
      if (length === maxUsers) {
        socket.to(socket.id).emit("room_full");
        return;
      }
      users[data.room].push({ id: socket.id, user: data.user });
    } else {
      users[data.room] = [{ id: socket.id, user: data.user }];
    }

    socketToRoom[socket.id] = data.room;

    socket.join(data.room);

    console.log(`[${socketToRoom[socket.id]}]: ${socket.id} enter`);

    const usersInThisRoom = users[data.room].filter((user) => user.id !== socket.id);

    console.log(usersInThisRoom);

    io.sockets.to(socket.id).emit("all_users", usersInThisRoom);
    socket.broadcast.emit("remoteUser", data.user);
    const roomID = socketToRoom[socket.id];
    let room = users[roomID];

    socket.broadcast.to(room).emit("remoteUser", data.user);
  });

  socket.on("send_message", (data) => {
    console.log("send_message : " + socket.id);
    io.sockets.emit("receive_message", { message: data.message, user: { id: socket.id, ...data.user } });
  });

  socket.on("offer", (sdp) => {
    console.log("offer : " + socket.id);
    socket.broadcast.emit("getOffer", sdp);
  });

  socket.on("answer", (sdp) => {
    console.log("answer : " + socket.id);
    socket.broadcast.emit("getAnswer", sdp);
  });

  socket.on("candidate", (candidate) => {
    console.log("candidate : " + socket.id);
    socket.broadcast.emit("getCandidate", candidate);
  });

  socket.on("disconnect", () => {
    console.log(`[${socketToRoom[socket.id]}]: ${socket.id} exit`);
    const roomID = socketToRoom[socket.id];
    let room = users[roomID];
    if (room) {
      room = room.filter((user) => user.id !== socket.id);
      users[roomID] = room;
      if (room.length === 0) {
        delete users[roomID];
        return;
      }
    }

    socket.broadcast.to(room).emit("user_exit", { id: socket.id });
    console.log("users : ", users);
  });
});

server.listen(9998, () => {
  console.log("Server is running on port " + 9998);
});
