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


    socket.on("create-room", (data, name, cb) => {
        createRoom(data, name, false);
    });

    function createRoom(data, name, setroom) {

        for (let i = 136; true; i++) {
            if (setroom) {
                i = setroom;
            }
            if (rooms.hasOwnProperty(i)) {
                continue;
            }
            let room = "CS" + i;
            data.leader = socket.id;
            rooms[room] = { host: socket.id, userids: [], question: "Q1", stage: "lobby", userdata:{}};
            console.log(`${socket.id} is joining room ${room}. Rooms has info ${JSON.stringify(rooms)}`);
            socket.join(String(i));
            socket.emit("joined_room", room, socket.id, name, rooms[room].stage);
            break;
        }
    }
    
    socket.on("join-room", (room, name, failedcb) => {
        joinRoom(room, name, failedcb);
    });

    function joinRoom(room, name, failedcb) {
        room = String(room);
        console.log("Attempting to join room, data is ", rooms[room])
        let late_join = rooms[room] && rooms[room].data && rooms[room].data.type && rooms[room].data.type != "teamblind";
        if (rooms.hasOwnProperty(room)) {
            if (rooms[room].stage != "lobby") {
                failedcb("Game already started.");
            } else if (rooms[room].userids.some((id) => userdata[id].name == name)) {
                failedcb("Name is taken");
            } else if (!rooms[room].userids.includes(socket.id)) {
                rooms[room].userids.push(socket.id);
                socket.join(String(room));
                console.log("Current rooms after joining", io.sockets.adapter.rooms, socket.id);
                io.to(rooms[room].host).emit("room_change", rooms);
                io.to(socket.id).emit("joined_room", room, socket.id, name, rooms[room].stage);
                console.log(`${socket.id} joined room ${room}. Updated Data: ${JSON.stringify(rooms)}`);
            }
        } else {
            failedcb("Invalid room #");
        }
    }
    
    socket.on("leave-room", (room) => {
        room = String(room);
        if (room != 0) {
            socket.leave(room);
            removePlayer(socket.id)
        }
    });

    socket.on("start-match", (room) => {
        room = String(room);
        if (rooms.hasOwnProperty(room) && rooms[room].stage == "lobby") {
            rooms[room].stage = "ingame";
            rooms[room].round = 0;
            if (rooms[room].data.type == "teamblind") {
                console.log("Setting match");
                if (rooms[room].data.startblind == 0 || rooms[room].userids.length == 1) {
                    rooms[room].data.blinded = rooms[room].userids[0];
                } else {
                    rooms[room].data.blinded = rooms[room].userids[1];
                }
                rooms[room].data.time = 0;
                rooms[room].data.startblind = 0;
            }
            io.to(room).emit("started-match", rooms[room], 
                getShuffle(rooms[room].data.dims[rooms[room].round], rooms[room].data.shufflearr[rooms[room].round] ?? false));
            io.emit("room_change", rooms);
        }
    });
    socket.on("solved", (room, time) => {
        room = String(room);
        console.log("Someone emitted solved", rooms[room].stage, time, socket.id);
        if (rooms.hasOwnProperty(room) && rooms[room].stage == "ingame") {
            rooms[room].solved[socket.id] = time;
            console.log("Beforer append, ", rooms, rooms[room], rooms[room].solved,rooms[room].solved[socket.id]);
            updateTimes(room);
            if (rooms.hasOwnProperty(room) && rooms[room].stage == "ingame") {
                rooms[room].solvedarr[rooms[room].round] = rooms[room].solved;
                console.log("Append solved", JSON.stringify(rooms[room].solvedarr));
            }
        }
    });
    socket.on("next-round", (room) => {
        room = String(room);
        console.log("Attempting next round");
        if (rooms.hasOwnProperty(room) && rooms[room].stage != "lobby") {
            console.log("Starting next round");
            rooms[room].stage = "ingame";
            rooms[room].round++;
            rooms[room].solved = {};
            rooms[room].progress = {};
            rooms[room].times = {};
            rooms[room].screenshots = {};
            io.to(room).emit("next-match", rooms[room], 
                getShuffle(rooms[room].data.dims[rooms[room].round], rooms[room].data.shufflearr[rooms[room].round] ?? false));
        }
    });

    socket.on("progress-update", (room, progress, time, posid) => {
        room = String(room);
        if (rooms.hasOwnProperty(room) && rooms[room].stage == "ingame") {
            rooms[room].progress[socket.id] = progress;
            rooms[room].times[socket.id] = time;
            if (rooms[room].data.type == "teamblind" && (socket.id == rooms[room].data.blinded || rooms[room].userids.length == 1)) {
                rooms[room].data.time = time;
                rooms[room].data.posid = posid;
            }
            console.log("emitting");
            io.to(room).emit("update-data", rooms[room]);
        }
    });

    socket.on("send-message", (message, room, username, image = false) => {
        if (rooms.hasOwnProperty(room) && rooms[room].userids.length > 1) {
            if (image == true)
                console.log("sending image");
            io.to(room).emit("sending-message", message, socket.id, {[socket.id] : username, ...rooms[room].names}, image);
        } else {
            console.log("sending to one person");
            socket.emit("sending-message", message, socket.id, {[socket.id] : username}, image);
        }
    })

    socket.on("send-screenshot", (screenshot, op) => {
        io.to(op).emit("update-screenshot", screenshot);
    })

    function updateTimes(room) {
        room = String(room);
        if (rooms.hasOwnProperty(room) && rooms[room].stage != "lobby") {
            if (Object.keys(rooms[room].solved).length == rooms[room].userids.length) {
                let winningtime = "DNF";
                for (let id in rooms[room].solved) {
                    const thetime = rooms[room].solved[id];
                    if (thetime != "DNF") {
                        if (winningtime == "DNF" || thetime < winningtime) {
                            winningtime = thetime;
                        }
                    }
                }
                rooms[room].stage = "results";
                console.log(`WINNING TIME ${winningtime}`);
                if (winningtime != "DNF") {
                    rooms[room].userids.forEach((id) => {
                        if (rooms[room].solved[id] == winningtime) {
                            if (!rooms[room].winners[id]) {
                                rooms[room].winners[id] = 1;
                            } else {
                                rooms[room].winners[id]++;
                            }
                        }
                    });
                }
                rooms[room].solvedarr[rooms[room].round] = rooms[room].solved;
                if (rooms[room].data && rooms[room].data.blinded)
                    rooms[room].data.blinded = "";
                console.log(`WINNER: ${JSON.stringify(rooms[room].winners)}`);
                io.to(room).emit("all-solved", rooms[room], rooms[room].winners);
            } else {
                io.to(room).emit("update-data", rooms[room]);
            }
        }
    }
    socket.on("giveup_blind", room => {
        if (rooms.hasOwnProperty(room) && rooms[room].stage != "lobby") {
            rooms[room].data.blinded = "";
            rooms[room].stage = "results";
            rooms[room].data.time = "DNF";
            io.to(room).emit("all-solved", rooms[room], rooms[room].winners);
            delete rooms[room];
            io.in(room).socketsLeave(room);
        }
    })
    socket.on("switch_blindfold", (room, blinded, time) => {
        if (rooms[room] && rooms[room].data) {
            rooms[room].data.blinded = blinded;
            rooms[room].data.startblind = time;
            io.to(room).emit("switched-blindfold", rooms[room]);
        }
    });

    socket.on("bot_connect", (id, DIM) => {
        console.log("BOT_CONNECTED")
        socket.join(id);
        bot_shuffle(id, DIM)
    })

    socket.on("bot_shuffle", (id, DIM) => {
        bot_shuffle(id, DIM)
    })

    function bot_shuffle(id, DIM) {
        const DIMOBJ = {50: "3x3", 100: "2x2"}
        const SHUFFLEOBJ = {50: 18, 100: 10}
        const scramble = shuffleCube(DIMOBJ[DIM], SHUFFLEOBJ[DIM], true);
        io.to(id).emit("bot_connected", scramble);
    }

    socket.on("start_race", () => {
        console.log("EMITTING", socket.id);
        io.to(socket.id).emit("started_race");
    });

    socket.on("race_win", (id, winner) => {
        io.to(id).emit("race_won", winner);
    })
    socket.on("disconnect", (reason) => {
        console.log(`User disconnected: ${socket.id}, Reason: ${reason}`);
        removePlayer(socket.id);
        console.log(io.engine.clientsCount)
        if (io.engine.clientsCount == 0) {
            rooms = {};
        }
       
    });

    function removePlayer(player) {
        Object.keys(rooms).forEach((room) => {
            if (rooms[room].userids && rooms[room].userids.includes(player)) {
                for (let i = 0; rooms[room] && i < rooms[room].userids.length; ++i) {
                    if (player == rooms[room].userids[i]) {
                        io.to(room).emit("left_room", room, socket.id, rooms[room].names);
                        if (rooms[room].solved && rooms[room].solved[player]) {
                            delete rooms[room].solved[player];
                            console.log("Deleting player from solved", rooms[room].solved)
                        }
                        if (rooms[room].times && rooms[room].times[player]) {
                            rooms[room].times[player] = "DNF";
                            console.log("Setting player to DNF")
                        }
                        rooms[room].userids.splice(i, 1);
                        if (rooms[room].userids.length == 0) {
                            delete rooms[room];
                            io.emit("room_change", rooms);
                            return;
                        }
                        if (rooms[room].data.leader == player) {
                            rooms[room].data.leader = rooms[room].userids[0];
                        }
                        if (rooms[room].stage == "lobby") {
                            io.to(room).emit("refresh_rooms", rooms[room], room);
                        } else if (rooms[room].stage == "ingame") {
                            updateTimes(room);
                        } else if (rooms[room].stage == "results") {
                            io.to(room).emit("all-solved", rooms[room], rooms[room].winners);
                        }
                        io.emit("room_change", rooms);
                        console.log(`${player} is leaving the room ${room}. Data is ${JSON.stringify(rooms)}`);
                    }
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