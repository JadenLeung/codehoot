import React from 'react';
import './Medal.css';
import Rectangle from './Rectangle';

function Medal({children, backgroundColor = "gold"}) {

  return (
    <div className="medal-container">
      <Rectangle width="50px" height="100px" backgroundColor="#0f42a3"></Rectangle>
      <div className="medal-circle" style={{backgroundColor: backgroundColor}}>{children}</div>
    </div>
  );
}

export default Medal;
