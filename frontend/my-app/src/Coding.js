import React, {useState, useEffect} from 'react';
import './Coding.css';
import Title from './Title';
import Compile from './Compile';
import Form from './Form';
import Output from './Output';


function Coding ({setCode, code, question, output, setOutput, endtime, socket, name, avatar}) {

  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      let t = Math.round((endtime - Date.now()) / 1000);
      setTime(t >= 0 ? t : 0);
    }, 100);

    return () => clearInterval(interval);
  }, [endtime]);

  return (
    <div>
          <Title color = "white">Codehoot!</Title>
          <Form setCode={setCode} code={code} question={question} />
          {time > 0 && <div>
                <Compile code={code} setOutput={setOutput} question={question} />
                <Output output={output} />
              </div>
          }
          <p className="time">{time}</p>
          <div className="profile">
            <img className="profile-avatar" src={`/data/avatars/${avatar}.png`} alt="Avatar"/>
            <p className="name">{name}</p>
          </div>
    </div>
  )
}

export default Coding;