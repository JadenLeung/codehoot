import React from 'react';
import './Title.css';

function Title({children, color, marginTop = "15px", onClick, className}) {

  return (
    <div >
      <h6 style={{color: color, marginTop : marginTop}} onClick={onClick} className={className}>{children}</h6>
    </div>
  );
}

export default Title;
