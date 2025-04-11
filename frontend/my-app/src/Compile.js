import React, {useState, useEffect} from 'react';
import './Compile.css';

function Compile({code, setOutput, question, socket, endtime, room}) {

  const [time, setTime] = useState(0);
  const [successHeight, setSuccessHeight] = useState("-70px");


  function riseSuccess() {
    if (successHeight == "-70px") {
      setSuccessHeight("0px");
    }
  }

   useEffect(() => {
      setTimeout(() => {
          if (successHeight == "0px") {
              setSuccessHeight("-70px");
          }
      }, 2000)
    }, [successHeight]);

  async function submitButton() {
    let t = ((endtime - Date.now()) / 1000);
    setTime(t >= 0 ? t : 0);
    
    setOutput({state: "Compiling..."});
    try {
        const response = await fetch("http://127.0.0.1:5005/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code : code.code, question: question }), // sending JSON
        });
        const data = await response.text();
        console.log(data)
        setOutput(JSON.parse(data))
        if (JSON.parse(data).hasOwnProperty("correct")) {
          socket.emit("submit-score", t, JSON.parse(data).correct, room, (str) => {
            riseSuccess();
          })
        }
        
    } catch (error) {
        setOutput(`Could not connect to server\n${error}`);
    }
  }

  return (
    <div className = "button_container">
      <button onClick={submitButton}>
        Submit
      </button>
      <div className="success" style={{bottom: successHeight}}>
          <p className="success-text">New High Score!</p>
      </div>
    </div>
  );
}

export default Compile;
