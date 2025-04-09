import React, { useEffect } from 'react';
import './Host.css';
import Title from './Title';
import Rectangle from './Rectangle';
import Mainbutton from './Mainbutton';

function Host({ players, mode, setMode, question, setQuestion }) {

    useEffect(() => {

    }, players);

  return (
    <div>
        <div className="container">
            <Rectangle width="900px">
                <div className="banner">
                    <div className="box">
                        <p className = "title">Join at {window.location.href.replace("http://", "")}</p>
                    </div>
                    <div className="box">
                        <p className = "title">Game PIN:</p>
                        <p className="pin">CS136</p>
                    </div>
                </div>
            </Rectangle>
        </div>
        <div className="container">
            {players.length == 0 && 
                <Rectangle backgroundColor="#260064" width="350px">
                    <p className="wait-text">Queue is empty</p>
                </Rectangle>
            }
            {players.length != 0 && 
                <div>
                    <div className = "player-container">
                        {players.map((player) => (
                        <div className="player-box"  key={player}>
                            <img src={`/data/avatars/${player.avatar}.png`} alt="Avatar" className="avatar"/>
                            <p className="wait-text">{player.name}</p>
                        </div>
                        ))}
                    </div>
                    <div className = "corner-container">
                        <div className="corner-box">
                            <i className="bi bi-person-fill"></i>
                            <p>{players.length}</p>
                        </div>
                        <Mainbutton fontSize="30px">Start</Mainbutton>
                    </div>
                </div>

            }
        </div>
    </div>
  );
}

export default Host;
