import React from 'react';
import './Title.css';

function Title({children, color}) {

  return (
    <div >
      <h6 style={{color: color}}>{children}</h6>
    </div>
  );
}

export default Title;
