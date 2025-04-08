import React from 'react';
import './Compile.css';

function Compile({code, setOutput, question}) {

  async function submitButton() {
    setOutput("Compiling...");
    try {
        const response = await fetch("http://127.0.0.1:5003/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code : code, question: question }), // sending JSON
        });
        const data = await response.text();
        console.log(data)
        if (!JSON.parse(data).hasOwnProperty("output")) {
            setOutput(JSON.parse(data).error + "\n" + JSON.parse(data).details);
        } else {
            setOutput(JSON.parse(data).output);
        }
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
