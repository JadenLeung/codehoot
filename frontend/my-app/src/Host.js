import React, { useEffect, useState } from 'react';
import './Host.css';
import Title from './Title';
import Rectangle from './Rectangle';
import Mainbutton from './Mainbutton';
import config from "./config.js";

function Host({ players, mode, setMode, question, setQuestion, room, socket, endtime, setEndTime }) {

    const [time, setTime] = useState(999);
    console.log(JSON.stringify(config), question, config.time[question])
    function startMatch() {
        if (mode == "hostlobby") {
            socket.emit("start-match", room, config.time[question] * 1000);
        } else if (time == 0) {
            socket.emit("view-leaderboard", room);
        } else {
            socket.emit("end-round", room);
        }
    }

    function addTime() {
        socket.emit("add-time", room, config.timeIncrement)
    }

    useEffect(() => {
      const interval = setInterval(() => {
        let t = Math.round((endtime - Date.now()) / 1000);
        setTime(t >= 0 ? t : 0);
      }, 100);
  
      return () => clearInterval(interval);
    }, [endtime]);

    useEffect(() => {
        socket.on("started-match2", (t) => {
            setEndTime(t)
            setMode("hostingame");
        })
    }, []);


    return (
    <div>
        <div className="container">
            { mode == "hostlobby" && 
                <Rectangle width="900px">
                    <div className="banner">
                        <div className="box">
                            <p className = "title">Join at {window.location.href.replace("http://", "")}</p>
                        </div>
                        <div className="box">
                            <p className = "title">Game PIN:</p>
                            <p className="pin">{room}</p>
                        </div>
                    </div>
                </Rectangle>
            }
            { mode != "hostlobby" && 
                <div className="hostlobby-container">
                    <Rectangle>
                        <p className = "title">Question {question.substring(1)}</p>
                    </Rectangle>
                    <p className="bigtime">{time}</p>
                    { time > 0 &&
                        <p className="plustime" onClick={addTime}>+</p>
                    }
                </div>
            }
        </div>
        <div className="container">
            {players.length == 0 && mode == "hostlobby" && 
                <Rectangle backgroundColor="#260064" width="350px">
                    <p className="wait-text">Queue is empty</p>
                </Rectangle>
            }
            {players.length != 0 && 
                <div>
                    { mode == "hostlobby" &&
                        <div className = "player-container">
                            {players.map((player) => (
                            <div className="player-box"  key={player}>
                                <img src={`/data/avatars/${player.avatar}.png`} alt="Avatar" className="avatar"/>
                                <p className="wait-text">{player.name}</p>
                            </div>
                            ))}
                        </div>
                    }
                    <div className = "corner-container">
                        <div className="corner-box">
                            <i className="bi bi-person-fill"></i>
                            <p>{players.length}</p>
                        </div> 
                        <Mainbutton fontSize="30px" onClick={startMatch}>{mode == "hostlobby" ? "Start" : time > 0 ? "Skip" : "Results"}</Mainbutton>
                    </div>
                </div>

            }
        </div>
    </div>
  );
}

export default Host;
