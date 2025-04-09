import React from 'react';
import './Mainbutton.css';

function Mainbutton({ children, width, onClick, fontSize }) {
  return (
    <button style={{width: width, fontSize:fontSize}} onClick={onClick}><b>{children}</b></button>
  );
}

export default Mainbutton;
