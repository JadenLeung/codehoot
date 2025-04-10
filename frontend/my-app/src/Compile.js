import React, {useState} from 'react';
import './Compile.css';

function Compile({code, setOutput, question, socket, endtime, room}) {

  const [time, setTime] = useState(0);

  async function submitButton() {
    let t = ((endtime - Date.now()) / 1000);
    setTime(t >= 0 ? t : 0);
    
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
        if (JSON.parse(data).hasOwnProperty("correct")) {
          socket.emit("submit-score", t, JSON.parse(data).correct, room, (str) => {
            alert(str);
          })
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
