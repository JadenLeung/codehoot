import React, {useState, useEffect} from 'react';
import './Titlecode.css';
import Title from './Title';
import Mainbutton from './Mainbutton';
import Rectangle from './Rectangle';
import config from './config';

function Titlecode({ setOutput, mode, setMode, buttonText, placeholderText, avatar, 
  setAvatar, socket, setRoom, room, setData, setEndTime, setName, setQuestion}) {


  const [errorHeight, setErrorHeight] = useState("-70px");
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [left, setLeft] = useState({"circle" : "-400px", "triangle" : "-100px"});
  const [right, setRight] = useState({"circle" : "-400px", "text" : "40px"});

  function riseError(str) {
    setError(str);
    if (errorHeight == "-70px") {
      setErrorHeight("-20px");
    }
  }

  function changeAvatar(avatar) {
    setAvatar(avatar);
    socket.emit("change-avatar", room, avatar);
  }

  function submitButton() {
    if (mode == "start") {
        if (text == "") {
          riseError("ⓘ Assertion failed, Game PIN must not be null")
        } else {
            socket.emit('attempt-join', text, (res) => {
              if (res) {
                setMode("entername");
                setText("");  
                setRoom(text);
                setErrorHeight("-70px");
              } else {
                riseError("ⓘ Runtime Error: Room not found");
              }
            });
        }
    } else {
        setName(text);
        if (text == "") {
          riseError("ⓘ Assertion failed, nickname must not be null");
        } else {
          socket.emit('join-room', room, text, "nomair", (res) => {
            if (res == "Game already started" || res == "Game already ended") {
              riseError("ⓘ " + res);
              setMode("start");  
              setText("");
            } else if (res == "Name is taken") {
              riseError("ⓘ " + res);
            }
          });
        }
    }
  }

  function hostGame() {
    socket.emit('create-room');
  }

  useEffect(() => {
    if (socket) {
      socket.on("created-room", (r, d) => {
        setMode("hostlobby");
        setErrorHeight("-70px");
        setRoom(r);
        setData(d);
        console.log("data:", r, d)
      });

      socket.on("joined-room", (stage) => {
        setMode(stage);    
        setErrorHeight("-70px");
      });

      socket.on("kick-you", () => {
        setMode("start");    
        riseError("ⓘ You have been kicked (freed)");
      });

      socket.on("started-match", (time, q) => {
        if (mode == "lobby" || mode == "results") {
          setMode("ingame");    
          setQuestion(q);
          setOutput("");
          setErrorHeight("-70px");
          setEndTime(time);
        } else if (mode == "changename") {
          setMode("start");
          riseError("ⓘ Game already started");
        }
      });

      return () => {
        socket.off("created-room");
        socket.off("joined-room");
        socket.off("started-match");
      };
    }
  }, [socket, mode]);

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

  if (mode != "results") {
    return (
      <>
        <div className="container">
          <div className="circle" style={{left:left.circle}}></div>
          <div className="C" style={{right:right.text}}>CS136</div>
          <div className="equilateral-triangle"  style={{left:left.triangle}}></div>
          { mode != "lobby" && mode != "hostlobby" &&
            <Rectangle marginTop="40px" width="280px">
                <input className="input-code" placeholder={placeholderText} type="text" value={text} maxLength={mode == "start" ? 6 : config.namelength}
                    onChange={(event) => {setText(mode == "start" ? event.target.value.toUpperCase() : event.target.value)}} 
                    onKeyDown={(event) => {event.key == "Enter" && submitButton()}}></input>
                <Mainbutton width = "250px" onClick={submitButton}>{buttonText}</Mainbutton>
            </Rectangle>
          }
          { mode == "lobby" &&

            <div>
                <img src = {`/data/avatars/${avatar}.png`} className="image"></img>
                <Title color="white">Welcome, {text}</Title>
                <p className="avatar-text">Select your avatar</p>
                {picList.map((pic) => (<img key={pic} src={`/data/avatars/${pic}.png`} className="image" id={pic} alt={pic} 
                onClick={() => {changeAvatar(pic)}}/>))}
                <br></br>
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
}

export default Titlecode;
