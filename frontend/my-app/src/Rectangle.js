import React, { useEffect } from 'react';
import './Rectangle.css';

function Rectangle({ children, width, marginTop, backgroundColor, height, marginBottom, opacity }) {
 
  return (
    <div className={`rectangle`} style={{width: width, marginTop: marginTop, marginBottom: marginBottom, opacity: opacity, backgroundColor: backgroundColor, height:height}}>{children}
        </div>
  );
}

export default Rectangle;
