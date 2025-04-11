import React, {useState, useEffect} from 'react';
import './Compile.css';
import config from './config';

function Compile({code, setOutput, question, socket, endtime, room, fetchCode}) {

  const [time, setTime] = useState(0);
  const [successHeight, setSuccessHeight] = useState("-70px");
  const [submitCooldown, setSubmitCooldown] = useState(0);


  function riseSuccess() {
    if (successHeight == "-70px") {
      setSuccessHeight("0px");
    }
  }

  function fetchStartCode() {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Are you sure you want to proceed? Doing this will delete all your current code.")) {
      fetchCode();
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
    if (submitCooldown > Date.now()) {
      alert("There is a " + config.submitCooldown + " second cooldown betwen submissions")
      return;
    }
    setSubmitCooldown(Date.now() + config.submitCooldown * 1000);
    let t = ((endtime - Date.now()) / 1000);
    setTime(t >= 0 ? t : 0);
    
    setOutput({state: "Compiling..."});
    try {
        const response = await fetch("http://127.0.0.1:5004/submit", {
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
        {submitCooldown > Date.now() ? Math.ceil((submitCooldown - Date.now()) / 1000) : "Submit"}
      </button>
      <button onClick={fetchStartCode} className="reset">
        Reset
      </button>
      <div className="success" style={{bottom: successHeight}}>
          <p className="success-text">New High Score!</p>
      </div>
    </div>
  );
}

export default Compile;
