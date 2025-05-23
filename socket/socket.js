const express = require("express");
const http = require("http");
const https = require('https');  // Add this line
const { Server } = require("socket.io");
const cors = require("cors");
const fs = require("fs");
const app = express();
const server = http.createServer(app);

dev = false;

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
});


// HTTPS Configuration
if (!dev) {
    var options = {
        key: fs.readFileSync("/etc/letsencrypt/live/api.virtual-cube.net/privkey.pem"),
        cert: fs.readFileSync("/etc/letsencrypt/live/api.virtual-cube.net/fullchain.pem")
    };
    var httpsServer = https.createServer(options, app);
}

// Create HTTPS server
const io = new Server(dev ? server : httpsServer, {
    cors: { 
        origin: '*',
        // origin: ["http://localhost:3000","https://jadenleung.github.io"],
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

    socket.on("check-joined", (id) => {
        for (let room in rooms) {
            if (rooms[room].deleteduserdata.hasOwnProperty(id)) {
                if (rooms[room].userids.hasOwnProperty(id) || rooms[room].userids.some((i) => rooms[room].userdata[i].name == rooms[room].deleteduserdata[id].name)) {
                    delete rooms[room].deleteduserdata[id];
                    return;
                }
                rooms[room].userids.push(socket.id);
                rooms[room].userdata[socket.id] = rooms[room].deleteduserdata[id];
                rooms[room].userdata[socket.id].passed = 0;
                delete rooms[room].deleteduserdata[id];
                socket.join(String(room));
                io.to(socket.id).emit("already-joined", rooms[room].userdata[socket.id].name, rooms[room].userdata[socket.id].avatar, rooms[room].userdata[socket.id].points, room);
                io.to(rooms[room].host).emit("room-change", rooms[room], socket.id, rooms[room].userdata[socket.id].name, rooms[room].userdata[socket.id].avatar, "join");
                if (rooms[room].stage == "ingame") {
                    io.to(socket.id).emit('started-match', rooms[room].time, rooms[room].question, rooms[room].userids.length, true, false);
                } else {
                    io.to(socket.id).emit("joined-room", rooms[room].stage);
                }
                console.log(`${socket.id} joined room ${room}.`);
            }
        }
    });

    socket.on("create-room", () => {
        createRoom();
    });

    function createRoom() {
        for (let i = 136; true; i = Math.round(Math.random() * 1000 + 1)) {
            if (rooms.hasOwnProperty("CS" + i)) {
                continue;
            }
            let room = "CS" + i;
            rooms[room] = { host: socket.id, userids: [], question: "Q1", stage: "lobby", userdata:{}, time: -1, testcases: -1, deleteduserdata: {}};
            console.log(`${socket.id} is joining room ${room}.`);
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
        if (rooms.hasOwnProperty(room)) {
            // if (rooms[room].stage != "lobby") {
            //     cb("Game already started");
            // } else 
            if (rooms[room].userids.some((id) => rooms[room].userdata[id].name == name)) {
                cb("Name is taken");
            } else if (!rooms[room].userids.includes(socket.id)) {
                rooms[room].userids.push(socket.id);
                rooms[room].userdata[socket.id] = {name: name, avatar: avatar, points: 0};
                socket.join(String(room));
                io.to(rooms[room].host).emit("room-change", rooms[room], socket.id, name, avatar, "join");
                if (rooms[room].stage == "ingame") {
                    io.to(socket.id).emit('started-match', rooms[room].time, rooms[room].question, rooms[room].userids.length, true);
                } else {
                    io.to(socket.id).emit("joined-room", rooms[room].stage);
                }
            }
        } else {
            cb("Game already ended");
        }
    }

    socket.on("change-avatar", (room, avatar) => {
        if (rooms[room] && rooms[room].userdata && rooms[room].userdata[socket.id] && rooms[room].userdata[socket.id].avatar && avatar) {
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

    socket.on("start-match", (room, timeLimit, testcases, config) => {
        room = String(room);
        if (rooms.hasOwnProperty(room) && rooms[room].stage == "lobby") {
            rooms[room].stage = "ingame";
            rooms[room].time = Date.now() + timeLimit;
            rooms[room].testcases = testcases;
            rooms[room].config = config;
            socket.to(room).emit('started-match', rooms[room].time, rooms[room].question, rooms[room].userids.length); // only others in that room
            socket.emit('started-match2', rooms[room].time, rooms[room].question);
        }
    });

    socket.on("next-round", (room, timeLimit, testcases, config, question) => {
        room = String(room);
        if (rooms.hasOwnProperty(room) && rooms[room].stage == "results") {
            rooms[room].stage = "ingame";
            rooms[room].question = question;
            rooms[room].time = Date.now() + timeLimit;
            rooms[room].testcases = testcases;
            rooms[room].config = config;
            rooms[room].userids.forEach((id) => {
                if (rooms[room].userdata[id].passed) {
                    delete rooms[room].userdata[id].passed;
                    delete rooms[room].userdata[id].time;
                }
            })
            socket.to(room).emit('started-match', rooms[room].time, rooms[room].question, rooms[room].userids.length); // only others in that room
            socket.emit('started-match2', rooms[room].time, rooms[room].question);
        }
    });

    socket.on("submit-score", (time, passed, room, cb) => {
            if (rooms.hasOwnProperty(room) && rooms[room].stage == "ingame" && rooms[room].userdata && rooms[room].userdata[socket.id]) {
                if (!rooms[room].userdata[socket.id].hasOwnProperty("passed") || passed > rooms[room].userdata[socket.id].passed) {
                    rooms[room].userdata[socket.id].time = time;
                    rooms[room].userdata[socket.id].passed = passed;
                    cb("highscore");
                    if (rooms[room].testcases == passed) {
                        io.to(rooms[room].host).emit('perfect-score', rooms[room].userdata[socket.id].name);
                    }
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
        if (rooms[room] && rooms[room].stage == "ingame") {
            rooms[room].stage = "results";
            let oldleaderboard = [];
            rooms[room].userids.forEach((id) => {
                oldleaderboard.push({id : id, points: rooms[room].userdata[id].points})
            });
    
            let scores = calculateScores(room);
            let points = {};
            for (let i = 0; i <= rooms[room].testcases; i++) {
                let deduct = 0;
                scores[i].forEach((userobj) => {
                    points[userobj.id] = Math.round((rooms[room].config.maxPoints / rooms[room].testcases) * userobj.passed - deduct);
                    if (i > 0 && deduct < rooms[room].config.tiebreakerMaxDeduct) {
                        deduct += rooms[room].config.tiebreakerDeduct;
                    }
                })
            }
            console.log("points is ", points);
            
            let leaderboard = [];
            rooms[room].userids.forEach((id) => {
                rooms[room].userdata[id].points += points[id];
                leaderboard.push({id : id, points: rooms[room].userdata[id].points})
            });
            leaderboard.sort((a, b) => {
                return b.points - a.points;
            });
    
            console.log("leaderboard is", leaderboard, "old is ", oldleaderboard);
            for (let i = 0; i < leaderboard.length; i++) {
                let id = leaderboard[i].id;
                socket.to(id).emit("view-score", leaderboard, oldleaderboard, points[id], i, 
                    rooms[room].userdata[id].passed ? rooms[room].userdata[id].passed : 0);
            }
            socket.emit("view-leaderboard", leaderboard, oldleaderboard, points, scores, rooms[room]);
        }
    })

    // Returns an array 0 - # Test Cases, each one with an array of the user and their time
    function calculateScores(room) {
        room = String(room);
        let scores = [];
        for (let i = 0; i <= rooms[room].testcases; i++) {
            scores[i] = [];
        }
        if (rooms.hasOwnProperty(room) && rooms[room].stage != "lobby") {
            rooms[room].userids.forEach((id) => {
                if (rooms[room].userdata[id] && rooms[room].userdata[id].passed && rooms[room].userdata[id].passed > 0) {
                    scores[rooms[room].userdata[id].passed].push({id: id, time: rooms[room].userdata[id].time, passed: rooms[room].userdata[id].passed});
                } else {
                    scores[0].push({id: id, time: 999999, passed: 0});
                }
            });
        }
        for (let i = 0; i <= rooms[room].testcases; i++) {
            scores[i].sort((a, b) => {
                return b.time - a.time;
            });
        }
        return scores;
    }

    socket.on("podium", (room) => {
        rooms[room].stage = "podium";
        socket.to(room).emit("podium");
    })

    socket.on("disconnect", (reason) => {
        console.log(`User disconnected: ${socket.id}, Reason: ${reason}`, rooms);
        removePlayer(socket.id);
        console.log(io.engine.clientsCount)
    
    });

    socket.on("kick-player", (id) => {
        removePlayer(id);
        io.to(id).emit("kick-you");
    })

    function removePlayer(player) {
        Object.keys(rooms).forEach((room) => {
            if (rooms[room]) {
                if (player == rooms[room].host) {
                    delete rooms[room];
                } else if (rooms[room].userids.includes(player)){
                    rooms[room].userids = rooms[room].userids.filter((p) => p != player);
                    io.to(rooms[room].host).emit("room-change", rooms[room], player, "", "", "leave");
                    rooms[room].deleteduserdata[player] = rooms[room].userdata[player];
                    delete rooms[room].userdata[player];
                }
                console.log(`Deleting player ${player}. Rooms has info ${JSON.stringify(rooms)}`)
            }
        })
    }
});

const PORT = process.env.PORT || 3001;

if (!dev) {
    // Start HTTPS server (which includes Socket.IO)
    httpsServer.listen(3001, () => {
        console.log('HTTPS server with Socket.IO running on port 3001');
    });
} else {
    server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}