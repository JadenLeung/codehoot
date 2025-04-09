import React, {useState, useEffect} from 'react';
import './Titlecode.css';
import Title from './Title';
import Mainbutton from './Mainbutton';
import Rectangle from './Rectangle';

function Titlecode({ output, mode, setMode, buttonText, placeholderText, avatar, setAvatar, socket}) {


  const [errorHeight, setErrorHeight] = useState("-70px");
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [left, setLeft] = useState({"circle" : "-400px", "triangle" : "-100px"});
  const [right, setRight] = useState({"circle" : "-400px", "text" : "40px"});

  function submitButton() {
    if (mode == "start") {
        if (text == "") {
            if (errorHeight == "-70px") {
                setError("ⓘ Assertion failed, Game PIN must not be null");
                setErrorHeight("-20px");
            }
        } else {
            setMode("entername");
            setText("");  
            setErrorHeight("-70px");
        }
    } else {
        if (text == "") {
            if (errorHeight == "-70px") {
                setError("ⓘ Assertion failed, nickname must not be null");
                setErrorHeight("-20px");
            }
        } else {
            setMode("lobby");    
            setErrorHeight("-70px");
        }
    }
  }

  function hostGame() {
    socket.emit('create-room');
  }

  useEffect(() => {
    if (socket) {
      socket.on("created-room", (room) => {
        setMode("hostlobby");
        setErrorHeight("-70px");
      })
      return () => {
        socket.off("created-room");
      };
    }

  }, [socket]);

  useEffect(() => {
    setTimeout(() => {
        if (errorHeight == "-20px") {
            setErrorHeight("-70px");
        }
    }, 3000)
  }, [errorHeight]);

  useEffect(() => {
    if (mode == "lobby" || mode == "hostlobby") {
        setLeft({"circle" : "-2000px", "triangle" : "-1000px"});
        setRight({"circle" : "-2000px", "text" : "-300px"});
    }
  }, [mode]);

  const picList = ["nomair", "watson", "urs", "aryo", "josh"]

  return (
    <>
      <div className="container">
        <div className="circle" style={{left:left.circle}}></div>
        <div className="C" style={{right:right.text}}>CS136</div>
        <div className="equilateral-triangle"  style={{left:left.triangle}}></div>
        { mode != "lobby" && mode != "hostlobby" &&
          <Rectangle marginTop="40px" width="280px">
              <input className="input-code" placeholder={placeholderText} type="text" value={text} maxLength={mode == "start" ? 6 : 16}
                  onChange={(event) => {setText(event.target.value)}} onKeyDown={(event) => {event.key == "Enter" && submitButton()}}></input>
              <Mainbutton width = "250px" onClick={submitButton}>{buttonText}</Mainbutton>
          </Rectangle>
        }
        { mode == "lobby" &&

          <div>
              <img src = {`/data/avatars/${avatar}.png`} className="image"></img>
              <Title color="white">Welcome, {text}</Title>
              <p className="avatar-text">Select your avatar</p>
              {picList.map((pic) => (<img key={pic} src={`/data/avatars/${pic}.png`} className="image" id={pic} alt={pic} 
              onClick={() => {setAvatar(pic)}}/>))}
              <br></br>
              <Mainbutton onClick={() => setMode("ingame")}>Continue</Mainbutton>
          </div>
        }
        <div className="circle2" style={{right:right.circle}}></div>
        <div className="error" style={{bottom: errorHeight}}>
          <p className="error-text">{error}</p>
        </div>
      </div>
        { mode == "start" &&
          <p className = "host-text" onClick={hostGame}>Click here to host a game</p>
        }

    </>
  );
}

export default Titlecode;
