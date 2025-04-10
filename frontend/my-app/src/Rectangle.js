import React, { useEffect } from 'react';
import './Rectangle.css';

function Rectangle({ children, width, marginTop, backgroundColor, height }) {
 
  return (
    <div className="rectangle" style={{width: width, marginTop: marginTop, backgroundColor: backgroundColor, height:height}}>{children}
        </div>
  );
}

export default Rectangle;
