import React from 'react';
import './Title.css';

function Title({children, color, marginTop}) {

  return (
    <div >
      <h6 style={{color: color, marginTop : marginTop}}>{children}</h6>
    </div>
  );
}

export default Title;
