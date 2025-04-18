import React, { useEffect } from 'react';
import './Rectangle.css';

function Rectangle({ children, width, marginTop, backgroundColor, height, marginBottom, opacity, className="", marginLeft}) {
 
  return (
    <div className={`rectangle${className ? " " + className : ""}`} style={{width: width, marginTop: marginTop, marginLeft: marginLeft, marginBottom: marginBottom, opacity: opacity, backgroundColor: backgroundColor, height:height}}>{children}
        </div>
  );
}

export default Rectangle;
