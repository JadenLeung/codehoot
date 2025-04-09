import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './App.css';
import Form from './Form';
import Title from './Title';
import Compile from './Compile';
import Output from './Output';
import Titlecode from './Titlecode';
import Host from './Host';

function App() {
  const [mode, setMode] = useState('start');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState({});
  const [question, setQuestion] = useState('Q1');
  const [avatar, setAvatar] = useState('nomair');
  const [players, setPlayers] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io('http://localhost:3004'); // Replace with your server URL
    setSocket(socketInstance);

    // Cleanup the socket connection when the component unmounts
    return () => {
      socketInstance.disconnect();
    };
  }, []);

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
            ["start", "entername", "lobby", "hostlobby"].includes(mode) &&
            <Titlecode setMode={setMode} mode = {mode} buttonText={mode === "start" ? "Enter" : "OK, go!" } 
              placeholderText={mode === "start" ? "Game PIN" : "Nickname" } avatar={avatar} setAvatar={setAvatar}/>
          }
        </div>
      {mode === "hostlobby"
        && <Host players={players} mode={mode} setMode={setMode} question={question} setQuestion={setQuestion}/>
      }
      {mode === "ingame" && (
        <>
          <Title color = "white">Codehoot!</Title>
          <Form setCode={setCode} code={code} question={question} />
          <Compile code={code} setOutput={setOutput} question={question} />
          <Output output={output} />
        </>
      )}
    </div>
  )
}

export default App;
