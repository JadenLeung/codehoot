import React, {useState, useEffect} from 'react';
import './Coding.css';
import Title from './Title';
import Compile from './Compile';
import Form from './Form';
import Output from './Output';
import config from './config';
import Rectangle from './Rectangle';


function Coding ({setCode, code, question, output, setOutput, endtime, socket, name, avatar, room, setMode, mode}) {

  const [time, setTime] = useState(0);
  const [leaderboardData, setLeaderboardData] = useState({});
  const [score, setScore] = useState(0);

  function getGrade(score) {
    console.log("score is " + score)
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

  function getPlace(num) {
    if (num < 5) {
      return " the top 5."
    }
    let str = num + "";
    if (num % 10 == 1) {
      str += "st place";
    } else if (num % 10 == 2) {
      str += "nd place";
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
    socket.on("view-score", (leaderboard, oldleaderboard, points, index, correct) => {
      setScore(leaderboard[index]);
      setMode("results");
      setLeaderboardData({ leaderboard, oldleaderboard, points, index, correct });
    });

    return () => {
      socket.off("view-score");
    };
  })

  return (
    <div>
      <div className="headercode">
          <div className="profile">
            <img className="profile-avatar" src={`/data/avatars/${avatar}.png`} alt="Avatar"/>
            <p className="name">{name}</p>
          </div>
          <Title color = "white" marginTop = "10px">Codehoot!</Title>
          {
            mode == "ingame" && <p className="time">{Math.round(time)}</p>
          }
          {
            mode == "results" && <Rectangle className="time" width="120px" marginTop="0px" backgroundColor="black">
              <p className="score-text">0</p>
            
            </Rectangle>
          }
          
      </div>
      {
        mode == "ingame" && 
        <div>
          <Form setCode={setCode} code={code} question={question} />
          {time > 0 && <div>
                <Compile code={code} setOutput={setOutput} question={question} socket={socket} endtime={endtime} room={room} />
                <Output output={output} />
              </div>
          }
        </div>
      }
      {
        mode == "results" && 
        <div className="leaderboard-client-container">
          <Rectangle height="90px" width="360px"  marginBottom="30px"><Title color="black">Score: {leaderboardData.correct}/{config.testcases[question]}</Title></Rectangle>
          <Title color="red"><span style={{color:"white"}}>Grade: </span>{getGrade(leaderboardData.correct/config.testcases[question] * 100)}</Title>
          <Rectangle height="90px" width="300px" marginTop="50px" backgroundColor="black" opacity="0.6"><Title color="white">+{" " + leaderboardData.points}</Title></Rectangle>
          <p className="ranktext">You're in {getPlace((leaderboardData.index + 1))}</p>
        </div>
      }
    </div>
  )
}

export default Coding;