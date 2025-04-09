import React, { useState } from 'react';
import './App.css';
import Form from './Form';
import Title from './Title';
import Compile from './Compile';
import Output from './Output';
import Titlecode from './Titlecode';

function App() {
  const [mode, setMode] = useState('start');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState({});
  const [question, setQuestion] = useState('Q1');
  const [avatar, setAvatar] = useState('nomair');

  if (mode == "start") {
    document.body.style.backgroundColor = '#511ca2';
  }

  return (
    <div className="App">
        <div style = {{marginTop: mode != "lobby" ? "275px" : "50px"}}>
          {["start", "entername"].includes(mode) && 
            <Title color="white" marginTop="275px">Codehoot!</Title>
          }
          {
            ["start", "entername", "lobby"].includes(mode) &&
            <Titlecode setMode={setMode} mode = {mode} buttonText={mode == "start" ? "Enter" : "OK, go!" } 
              placeholderText={mode == "start" ? "Game PIN" : "Nickname" } avatar={avatar} setAvatar={setAvatar}/>
          }
        </div>
      {mode == "ingame" && (
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
