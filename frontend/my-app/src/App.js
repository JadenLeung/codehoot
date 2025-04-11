import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './App.css';
import Title from './Title';
import Titlecode from './Titlecode';
import Host from './Host';
import Coding from './Coding';

function App() {
  const [mode, setMode] = useState('start');
  const [code, setCode] = useState({in: "", expect: "", code: ""});
  const [name, setName] = useState('');
  const [output, setOutput] = useState({});
  const [question, setQuestion] = useState('Q1');
  const [avatar, setAvatar] = useState('nomair');
  const [players, setPlayers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState(null);
  const [data, setData] = useState({});
  const [endtime, setEndTime] = useState(0);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const socketInstance = io('http://localhost:3004'); // Replace with your server URL
    setSocket(socketInstance);

    // Cleanup the socket connection when the component unmounts
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("room-change", (d, id, name, avatar, action) => {
        console.log("host", id)
        if (action == "join") {
          setData(d);
          setPlayers(prevPlayers => [...prevPlayers, { id, name, avatar }]);
        } else if (action == "leave") {
          setPlayers(prevPlayers => prevPlayers.filter((player) => player.id !== id));
        } else if (action == "avatar") {
          setPlayers(prevPlayers => prevPlayers.map((player) => (player.id == id) ? { ...player, avatar : avatar} : player));
        }
      })
      socket.on("time-change", (t) => {
        setEndTime(t);
      });

      return () => {
        socket.off("room-change");
        socket.off("time-change");
      };
    }
  }, [socket]);

  if (mode === "start") {
    document.body.style.backgroundColor = '#511ca2';
  }

  return (
    <div className="App">
        <div style = {{marginTop: ["start", "entername"].includes(mode) ? "275px" : "50px"}}>
          {["start", "entername"].includes(mode) && 
            <Title color="white" marginTop="275px">Codehoot!</Title>
          }
          {
            ["start", "entername", "lobby", "hostlobby", "results"].includes(mode) &&
            <Titlecode setMode={setMode} mode = {mode} buttonText={mode === "start" ? "Enter" : "OK, go!" } socket={socket}
              placeholderText={mode === "start" ? "Game PIN" : "Nickname" } avatar={avatar} setAvatar={setAvatar} 
              setRoom={setRoom} setData={setData} room={room} data={data} setEndTime={setEndTime} setName={setName} setQuestion={setQuestion}/>
          }
        </div>
      {(["hostlobby", "hostingame", "hostresults", "hostleaderboard", "hostpodium"].includes(mode))
        && <Host players={players} setPlayers={setPlayers} mode={mode} setMode={setMode} question={question} 
          setQuestion={setQuestion} room={room} data={data} setData={setData} socket={socket} endtime={endtime} setEndTime={setEndTime}/>
      }
      {["ingame", "results", "podium"].includes(mode) && (
        <Coding setCode={setCode} code={code} question={question} output={output} setOutput={setOutput}
        endtime={endtime} data={data} socket={socket} name={name} avatar={avatar} room={room} mode={mode}
          setMode={setMode} points={points} setPoints={setPoints}
        ></Coding>
      )}
    </div>
  )
}

export default App;
