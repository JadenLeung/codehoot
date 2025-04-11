import React, { useEffect, useState } from 'react';
import './Host.css';
import Title from './Title';
import Rectangle from './Rectangle';
import Mainbutton from './Mainbutton';
import config from "./config.js";

function Host({ setPlayers, players, mode, setMode, question, setQuestion, room, socket, endtime, setEndTime, data, setData }) {

    const [time, setTime] = useState(999);
    const [leaderboardData, setLeaderboardData] = useState({});
    function startMatch() {
        if (mode == "hostlobby") {
            socket.emit("start-match", room, config.time[question] * 1000, config.testcases[question], config);
        } else if (mode == "hostresults") {
            if (question == "Q" + config.questions) {
                setMode("hostpodium");
                socket.emit("podium", room);
            } else {
                setMode("hostleaderboard")
            }
        } else if (mode == "hostleaderboard") {
            const newquestion = "Q" + (+(question.slice(1)) + 1);
            socket.emit("next-round", room, config.time[newquestion] * 1000, config.testcases[newquestion], config, newquestion);
        } else if (time == 0 && mode == "hostingame") {
            socket.emit("view-leaderboard", room);
        } else {
            socket.emit("end-round", room);
        }
    }

    function removePlayer(id) {
        console.log("ID is ", id, socket.id)
        socket.emit("kick-player", id);

    }

    function addTime() {
        socket.emit("add-time", room, config.timeIncrement)
    }

    function dashString(testcases) {
        let str = "----";
        for (let i = 0; i < testcases - 2; i++) {
            str += "----";
        }
        return str;
    }

    useEffect(() => {
      const interval = setInterval(() => {
        let t = ((endtime - Date.now()) / 1000);
        setTime(t >= 0 ? t : 0);
      }, 100);
  
      return () => clearInterval(interval);
    }, [endtime]);

    useEffect(() => {
        socket.on("started-match2", (t, q) => {
            setQuestion(q);
            setEndTime(t)
            setMode("hostingame");
        });
        socket.on("view-leaderboard", (leaderboard, oldleaderboard, points, scores, d) => {
            setData(d);
            setMode("hostresults");
            setLeaderboardData({ leaderboard, oldleaderboard, points, scores });
            console.log("Viewing leaderboard", { leaderboard, oldleaderboard, points, scores })
        });

        return (() => {
            socket.off("started-match2");
            socket.off("view-leaderboard");
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
            { mode == "hostingame" && 
                <div className="hostlobby-container">
                    <Rectangle>
                        <p className = "title">Question {question.substring(1)}</p>
                    </Rectangle>
                    <p className="bigtime">{Math.round(time)}</p>
                    { time > 0 &&
                        <p className="plustime" onClick={addTime}>+</p>
                    }
                </div>
            }
            { mode == "hostresults" && 
                <div>
                    <Rectangle height="90px"><Title>Results</Title></Rectangle>
                <div className="bargraph">
                    {leaderboardData.scores.map((arr, i) => (
                        <div key={i}>
                            <Rectangle height={arr.length * (40 / players.length) + "vh"} width="100px" 
                                backgroundColor={config.colors[i % config.colors.length]} key={i}></Rectangle>
                            <p className="bartext">{arr.length}</p>
                        </div>
                    ))}
                </div>
                <p className="bartext">{`0${dashString(config.testcases[question])}Tests Passed${dashString(config.testcases[question])}${config.testcases[question]}`}</p>
                </div>
            }
            { mode == "hostleaderboard" && 
                <div className="leaderboard-container">
                    <Rectangle height="90px" width="400px"><Title>Leaderboard</Title></Rectangle>
                    {leaderboardData.leaderboard.map((obj, i) => (
                        i < 10 && <Rectangle height="70px" width="800px">{
                            <div className = "leaderboard-bar">
                                <div className = "leaderboard-profile">
                                    <img className="leaderboard-img" src={`/data/avatars/${data.userdata[obj.id].avatar}.png`}></img>
                                    <p className="leaderboardtext">{data.userdata[obj.id].name}</p>
                                </div>
                                <p className="leaderboardtext">{obj.points}</p>
                            </div>
                        }</Rectangle>
                    ))}
                </div>
            }
            { mode == "hostpodium" && 
                <div>
                <div className="bargraph">
                    {leaderboardData.leaderboard.length >= 3 && 
                        <div className="placement">
                            <div className="player-box2">
                                <img src={`/data/avatars/${data.userdata[leaderboardData.leaderboard[2].id].avatar}.png`} alt="Avatar" className="avatar"/>
                                <p className="wait-text2">{data.userdata[leaderboardData.leaderboard[2].id].name}</p>
                            </div>
                            <Rectangle height="350px" width="375px" 
                                backgroundColor="#cd7f32"><p className="bartext2">#3</p></Rectangle>
                            <p className="bartext">{leaderboardData.leaderboard[2].points}</p>
                        </div>
                    }
                    {leaderboardData.leaderboard.length >= 1 && 
                        <div className="placement">
                            <div className="player-box2">
                                <img src={`/data/avatars/${data.userdata[leaderboardData.leaderboard[0].id].avatar}.png`} alt="Avatar" className="avatar"/>
                                <p className="wait-text2">{data.userdata[leaderboardData.leaderboard[0].id].name}</p>
                            </div>
                            <Rectangle height="450px" width="375px" 
                                backgroundColor="gold"><p className="bartext2">#1</p></Rectangle>
                            <p className="bartext">{leaderboardData.leaderboard[0].points}</p>
                        </div>
                    }
                    {leaderboardData.leaderboard.length >= 2 && 
                        <div className="placement">
                            <div className="player-box2">
                                <img src={`/data/avatars/${data.userdata[leaderboardData.leaderboard[1].id].avatar}.png`} alt="Avatar" className="avatar"/>
                                <p className="wait-text2">{data.userdata[leaderboardData.leaderboard[1].id].name}</p>
                            </div>
                            <Rectangle height="400px" width="375px" 
                                backgroundColor="#c0c0c0"><p className="bartext2">#2</p></Rectangle>
                            <p className="bartext">{leaderboardData.leaderboard[1].points}</p>
                        </div>
                    }


                </div>
                <p className="bartext">Good job to all participants!</p>
                </div>
            }
        </div>
        <div className="container">
            {players.length == 0 && mode == "hostlobby" && 
                <Rectangle backgroundColor="#260064" width="350px">
                    <p className="wait-text">Queue is empty</p>
                </Rectangle>
            }
            {players.length != 0 && mode != "hostpodium" &&
                <div>
                    { mode == "hostlobby" &&
                        <div className = "player-container">
                            {players.map((player) => (
                            <div className="player-box"  key={player}>
                                <img src={`/data/avatars/${player.avatar}.png`} alt="Avatar" className="avatar"/>
                                <p className="wait-text strikethrough" onClick={() => {removePlayer(player.id)}}>{player.name}</p>
                            </div>
                            ))}
                        </div>
                    }
                    <div className = "corner-container">
                        <div className="corner-box">
                            <i className="bi bi-person-fill"></i>
                            <p>{players.length}</p>
                        </div> 
                        <Mainbutton fontSize="30px" onClick={startMatch}>{mode == "hostlobby" ? "Start" : time > 0 ? 
                            "Skip" : mode == "hostingame" ? "Results" : mode == "hostresults" ? (question == "Q" + config.questions ? "Podium" : "View Leaderboard") : "Next Round"}</Mainbutton>
                    </div>
                </div>

            }
        </div>
    </div>
  );
}

export default Host;
