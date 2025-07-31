import React, {useState, useEffect} from 'react';
import './Coding.css';
import Title from './Title';
import Compile from './Compile';
import Form from './Form';
import Output from './Output';
import config from './config';
import Rectangle from './Rectangle';
import Medal from './Medal';
import Mainbutton from './Mainbutton';


function Coding ({setCode, code, question, setQuestion, output, setOutput, endtime, setEndTime, socket, 
    name, avatar, room, setMode, mode, points, setPoints, numPlayers}) {

  const [time, setTime] = useState(0);
  const [leaderboardData, setLeaderboardData] = useState({});
  const [score, setScore] = useState(0);
  const [file, setFile] = useState("main.c");
  const maxwidth = 1300;
  const [wwidth, setWwidth] = useState(window.innerWidth);


  const fetchCode = async () => {
    try {
      console.log(question, !localStorage[question])
      if (question && !(localStorage[question])) {
        let res = await fetch(`${config.flask}/code?question=${config.qdata[question].name}`);
        let data = await res.json();
        setCode(data);
      }
    } catch (err) {
      console.error("Failed to fetch code:", err);
      const error = `// Failed to load starter code\n// ${err}\n// Press 'Reset' to try again`;
      setCode({code: error, in: error, expect: error, solution: error})
    }
  };

  useEffect(() => {
    if (mode.includes("ingame") && code.code != "// Fetching code from server...") {
      localStorage[question] = code.code;
    }
  }, [code]);

  useEffect(() => {
    setWwidth(window.innerWidth);
    console.log("width is ", window.innerWidth, window.innerWidth > maxwidth);
  }, [window.innerWidth])

  function soloNext(dx) {
    const q = "Q" + (+(question.slice(1)) + dx);
    if (q == "Q" + (Object.keys(config.qdata).length + 1) || q == "Q0") {
      return;
    }
    setQuestion(q);
    if (localStorage[q]) {
      setCode(prev => ({...prev, code: localStorage[q]}));
    } else {
      setCode(prev => ({...prev, code: "// Fetching code from server..."}));
    }
    setOutput("");
    setEndTime(Date.now() + config.qdata[q].time * 1000);
  }

  function getGrade(score) {
    let finalgrade = "F"; // default
    const grades = Object.keys(config.grades)
      .map(Number)               // convert string keys to numbers
      .sort((a, b) => b - a);    // sort descending

    for (let grade of grades) {
      if (score >= grade) {
        finalgrade = config.grades[grade];
        break;
      }
    }
    return finalgrade;
  }

  function getPlace(num, gatekeep) {
    if (num <= 5 && gatekeep) {
      return "You're in the top 5.";
    }
    if (num / numPlayers > config.showRank && num > 3) {
      const inspiration = config.inspiration;
      let random = inspiration[Math.floor(Math.random() * inspiration.length)];
      if (random[0] == "/") {
        return (<img src={process.env.PUBLIC_URL + random} className="meme-image" />);
      }
      return random;
    }
    let str = "";
    str = (gatekeep ? "You're in " : "You got ") + num;
      if (num == 1) {
        str += "st place";
      } else if (num == 2) {
        str += "nd place";
      } else if (num == 3) {
        str += "rd place";
      } else {
        str += "th place";
      }
    return str;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      let t = ((endtime - Date.now()) / 1000);
      setTime(t >= 0 ? t : 0);
    }, 100);

    return () => clearInterval(interval);
  }, [endtime]);

  useEffect(() => {
    socket.on("view-score", (leaderboard, oldleaderboard, p, index, correct) => {
      setScore(leaderboard[index]);
      setMode("results");
      setPoints(prev => prev + p);
      setLeaderboardData({ leaderboard, oldleaderboard, points: p, index, correct });
    });

    socket.on("podium", () => {
      setMode("podium")
    });

    return () => {
      socket.off("view-score");
      socket.off("podium");
    };
  })

  return (
    <div>
      <div className="headercode">
        <div className="profile_container">
          { mode != "soloingame" &&
            <div className="profile">
              <img className="profile-avatar" src={`${process.env.PUBLIC_URL}/data/avatars/${avatar}.png`} alt="Avatar"/>
              <p className="name">{name}</p>
            </div>
          }
        </div>
        <Title color = "white" marginTop = "10px" onClick={() => {socket.emit("kick-player", socket.id); setMode("start")}} className="codehoot-title">Codehoot!</Title>
        <div className="timeholder"> 
          {
            ["ingame", "soloingame"].includes(mode) && <p className="time">{Math.round(time)}</p>
          }
          {
            ["soloingame"].includes(mode) && <button className="next-button" onClick={() => soloNext(-1)}>Prev</button>
          }
          {
            ["soloingame"].includes(mode) && <button className="next-button" onClick={() => soloNext(1)}>Next</button>
          }
          {
            mode == "results" && <Rectangle className="time results" width="120px" marginTop="0px" backgroundColor="black">
              <p className="score-text">{points}</p>
            
            </Rectangle>
          }
          </div>
      </div>
      {
        ["ingame", "soloingame"].includes(mode) && 
        <div className="code-container">
          <div>
            <Rectangle backgroundColor ="#1e1e1e" className="vscode-navbar" width="900px" height="25px">
              {["main.c", "public.in", "public.expect"].map((name) => (
                  <button className={`navbar-button${file == name ? "-selected" : "-unselected"}`} onClick={() => {setFile(name)}}>{name}</button>
              ))}
            </Rectangle>
            <Form setCode={setCode} code={code} question={question} width="900px" file={file} fetchCode={fetchCode} height={wwidth > maxwidth ? "500px" : "400px"}/>
            {time > 0 && <div>
                  <Compile code={code} setCode={setCode} setOutput={setOutput} question={question} socket={socket} endtime={endtime} room={room} fetchCode={fetchCode}/>
                </div>
            }
          </div>
          <Rectangle backgroundColor="black" className="compiler-output scrollable" 
            marginLeft={window.innerWidth > maxwidth ? "10px" : "0px"}  marginTop={window.innerWidth > maxwidth ? "40px" : "5px"} 
            width={window.innerWidth > maxwidth ? "50%" : "900px"} height={wwidth > maxwidth ? "525px" : "400px"}><Output output={output} className="bruh"/></Rectangle>
        </div>
      }
      {
        mode == "results" && 
        <div className="leaderboard-client-container">
          <Rectangle height="90px" width="360px"  marginBottom="30px"><Title color="black">Score: {leaderboardData.correct ?? 0}/{config.qdata[question].testcases}</Title></Rectangle>
          {/* <Title color="red"><span style={{color:"white"}}>Grade: </span>{getGrade(leaderboardData.correct/config.qdata[question].testcases * 100)}</Title> */}
          <Rectangle height="90px" width="300px" marginTop="50px" backgroundColor="black" opacity="0.6"><Title color="white">+{" " + (leaderboardData.points ?? 0)}</Title></Rectangle>
          <p className="ranktext">{typeof(leaderboardData.index) == "number" ? getPlace((leaderboardData.index + 1), true) : "Currently unranked"}</p>
        </div>
      }
      {
        mode == "podium" && 
        <div className="leaderboard-client-container">
          {((leaderboardData.index + 1) / numPlayers <= config.showRank || leaderboardData.index <= 2) &&
            <Title>{getPlace((leaderboardData.index + 1), false)}</Title>
          }
          <Title>Final Score: {points}</Title>
          {
            ((leaderboardData.index + 1) / numPlayers <= config.showRank || leaderboardData.index <= 2) && 
            <div>
              <Medal backgroundColor={config.medalColor[leaderboardData.index] ?? "purple"}>
                <p className="medal-text" style ={{color: "white", fontSize: "60px" }}>{leaderboardData.index + 1}</p>
              </Medal>
              <img src = {`${process.env.PUBLIC_URL}/data/medals/nathan-${leaderboardData.index + 1}.png`} style = {{height:"100px", marginTop: "20px"}}></img>
            </div>
          }
          <Title>Thanks for playing!</Title>
        </div>
      }
    </div>
  )
}

export default Coding;