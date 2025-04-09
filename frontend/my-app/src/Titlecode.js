import React from 'react';
import './Titlecode.css';
import Mainbutton from './Mainbutton';

function Titlecode({ output }) {
  return (
    <div className="container">
      <div className="circle"></div>
      <div className="C">CS136</div>
      <div className="equilateral-triangle"></div>
      <div className="rectangle">
        <input className="input-code" placeholder="Game PIN"></input>
        <Mainbutton width = "250px" onClick={() => alert("hey")}>Enter</Mainbutton>
      </div>
      <div className="circle2"></div>
    </div>
  );
}

export default Titlecode;
