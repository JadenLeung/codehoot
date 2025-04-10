const express = require("express");
const http = require("http");
const https = require('https');  // Add this line
const { Server } = require("socket.io");
const cors = require("cors");
const fs = require("fs");
const app = express();
const server = http.createServer(app);

dev = true;

// HTTPS Configuration
// if (!dev) {
//     var options = {
//         key: fs.readFileSync("/etc/letsencrypt/live/api.virtual-cube.net/privkey.pem"),
//         cert: fs.readFileSync("/etc/letsencrypt/live/api.virtual-cube.net/fullchain.pem")
//     };
//     var httpsServer = https.createServer(options, app);
// }

// Create HTTPS server
const io = new Server(dev ? server : httpsServer, {
    cors: { 
        origin: ["http://localhost:3000","https://jadenleung.github.io"],
        methods: ["GET", "POST"]
    },
  // transports: ["polling"] // Forces long polling instead of WebSockets
});

app.get("/", (req, res) => {
                  res.json({ message: "Codehoot World 1" });
});

app.use(cors());
app.use(express.static("public"));

let rooms = {};

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);


    socket.on("create-room", () => {
        createRoom();
    });

    function createRoom() {
        for (let i = 136; true; i = Math.round(Math.random() * 1000 + 1)) {
            if (rooms.hasOwnProperty("CS" + i)) {
                continue;
            }
            let room = "CS" + i;
            rooms[room] = { host: socket.id, userids: [], question: "Q1", stage: "lobby", userdata:{}, time: -1, testcases: -1};
            console.log(`${socket.id} is joining room ${room}. Rooms has info ${JSON.stringify(rooms)}`);
            socket.join(room);
            socket.emit("created-room", room, rooms[room]);
            break;
        }
    }
    
    socket.on("attempt-join", (room, cb) => {
        cb(rooms.hasOwnProperty(room));
    });

    socket.on("join-room", (room, name, avatar, failedcb) => {
        joinRoom(room, name, avatar, failedcb);
    });

    function joinRoom(room, name, avatar, cb) {
        room = String(room);
        console.log("Attempting to join room, data is ", rooms[room])
        if (rooms.hasOwnProperty(room)) {
            if (rooms[room].stage != "lobby") {
                cb("Game already started");
            } else if (rooms[room].userids.some((id) => rooms[room].userdata[id].name == name)) {
                cb("Name is taken");
            } else if (!rooms[room].userids.includes(socket.id)) {
                rooms[room].userids.push(socket.id);
                rooms[room].userdata[socket.id] = {name: name, avatar: avatar, points: 0};
                socket.join(String(room));
                console.log("Current rooms after joining", io.sockets.adapter.rooms, socket.id);
                io.to(rooms[room].host).emit("room-change", rooms[room], socket.id, name, avatar, "join");
                io.to(socket.id).emit("joined-room", rooms[room].stage);
                console.log(`${socket.id} joined room ${room}. Updated Data: ${JSON.stringify(rooms)}`);
            }
        } else {
            cb("Game already ended");
        }
    }

    socket.on("change-avatar", (room, avatar) => {
        if (rooms[room]) {
            rooms[room].userdata[socket.id].avatar = avatar;
            io.to(rooms[room].host).emit("room-change", rooms[room], socket.id, "", avatar, "avatar");
        }
    })
    
    socket.on("leave-room", (room) => {
        room = String(room);
        if (room != 0) {
            socket.leave(room);
            removePlayer(socket.id)
        }
    });

    socket.on("start-match", (room, timeLimit, testcases) => {
        room = String(room);
        if (rooms.hasOwnProperty(room) && rooms[room].stage == "lobby") {
            socket.to(room).emit('started-match', rooms[room].time); 
            rooms[room].stage = "ingame";
            rooms[room].time = Date.now() + timeLimit;
            rooms[room].testcases = testcases;
            io.to(room).emit('started-match', rooms[room].time); // only others in that room
            socket.emit('started-match2', rooms[room].time);
        }
    });

    socket.on("submit-score", (time, passed, room, cb) => {
        if (rooms.hasOwnProperty(room) && rooms[room].stage == "ingame") {
            if (!rooms[room].userdata[socket.id].passed || passed > rooms[room].userdata[socket.id].passed) {
                rooms[room].userdata[socket.id].time = time;
                rooms[room].userdata[socket.id].passed = passed;
                console.log("Score submited", time, rooms[room].userdata[socket.id])
                cb("highscore");
            }
        }
    });

    socket.on("end-round", (room) => {
        console.log("End round")
        rooms[room].time = Date.now();
        io.to(room).emit("time-change", rooms[room].time);
    })

    socket.on("add-time", (room, add) => {
        console.log("Add Time")
        rooms[room].time = rooms[room].time + add * 1000;
        io.to(room).emit("time-change", rooms[room].time);
    })

    socket.on("view-leaderboard", (room) => {
        let scores = calculateScores(room);
    })


    function calculateScores(room) {
        room = String(room);
        let scores = [];
        for (let i = 0; i <= rooms[room].testcases; i++) {
            scores[i] = [];
        }
        if (rooms.hasOwnProperty(room) && rooms[room].stage != "lobby") {
            rooms[room].userids.forEach((id) => {
                if (rooms[room].userdata[id] && rooms[room].userdata[id].passed && rooms[room].userdata[id].passed > 0) {
                    scores[rooms[room].userdata[id].passed].push({id: id, time: rooms[room].userdata[id].time});
                } else {
                    scores[0].push({id: id, time: "DNF"});
                }
            });
        }
        console.log("scores is", scores);
    }

    socket.on("disconnect", (reason) => {
        console.log(`User disconnected: ${socket.id}, Reason: ${reason}`, rooms);
        removePlayer(socket.id);
        console.log(io.engine.clientsCount)
       
    });

    function removePlayer(player) {
        Object.keys(rooms).forEach((room) => {
            if (rooms[room]) {
                if (player == rooms[room].host) {
                    delete rooms[room];
                } else if (rooms[room].userids.includes(player)){
                    io.to(rooms[room].host).emit("room-change", rooms[room], socket.id, "", "", "leave");
                    rooms[room].userids = rooms[room].userids.filter((p) => p != player);
                }
                console.log(`Deleted room ${room}. Rooms has info ${JSON.stringify(rooms)}`)
            }
        })
    }
});

const PORT = process.env.PORT || 3004;

if (!dev) {
    // Start HTTPS server (which includes Socket.IO)
    httpsServer.listen(3004, () => {
        console.log('HTTPS server with Socket.IO running on port 3003');
    });
} else {
    server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}