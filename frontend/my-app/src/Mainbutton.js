import React from 'react';
import './Mainbutton.css';

function Mainbutton({ children, width, onClick }) {
  return (
    <button style={{width: width}} onClick={onClick}><b>{children}</b></button>
  );
}

export default Mainbutton;
