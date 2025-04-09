import React from 'react';
import './Compile.css';

function Compile({code, setOutput, question}) {

  async function submitButton() {
    setOutput({state: "Compiling..."});
    try {
        const response = await fetch("http://127.0.0.1:5004/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code : code, question: question }), // sending JSON
        });
        const data = await response.text();
        console.log(data)
        setOutput(JSON.parse(data))
    } catch (error) {
        setOutput(`Could not connect to server\n${error}`);
    }
  }

  return (
    <div className = "button_container">
      <button
        onClick={submitButton}
      >
        Submit
      </button>
    </div>
  );
}

export default Compile;
