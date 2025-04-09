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
  const [question, setQuestion] = useState('Q2');

  if (mode == "start") {
    document.body.style.backgroundColor = '#511ca2';
  }

  return (
    <div className="App">
      {mode == "start" && (
        <div style = {{marginTop: "275px"}}>
          <Title color="white">Codehoot!</Title>
          <Titlecode/>
        </div>
      )}
      {mode == "ingame" && (
        <>
          <Title>Codehoot!</Title>
          <Form setCode={setCode} code={code} question={question} />
          <Compile code={code} setOutput={setOutput} question={question} />
          <Output output={output} />
        </>
      )}
    </div>
  );
}

export default App;
