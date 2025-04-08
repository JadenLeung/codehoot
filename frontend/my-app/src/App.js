import React, { useState } from 'react';
import './App.css';
import Form from './Form';
import Title from './Title';
import Compile from './Compile';
import Output from './Output';

function App() {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');

  return (
    <div className="App">
      <Title/>
      <Form setCode={setCode} code={code}/>
      <Compile code={code} setOutput={setOutput}/>
      <Output output={output}/>
    </div>
  );
}

export default App;
