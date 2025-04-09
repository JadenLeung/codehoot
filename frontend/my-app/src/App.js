import React, { useState } from 'react';
import './App.css';
import Form from './Form';
import Title from './Title';
import Compile from './Compile';
import Output from './Output';

function App() {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState({});
  const [question, setQuestion] = useState('Q1');

  return (
    <div className="App">
      <Title/>
      <Form setCode={setCode} code={code} question = {question}/>
      <Compile code={code} setOutput={setOutput} question = {question}/>
      <Output output={output}/>
    </div>
  );
}

export default App;
