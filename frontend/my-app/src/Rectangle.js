import React, { useEffect } from 'react';
import './Rectangle.css';

function Rectangle({ children, width, marginTop, backgroundColor }) {
 
  return (
    <div className="rectangle" style={{width: width, marginTop: marginTop, backgroundColor: backgroundColor}}>{children}
        </div>
  );
}

export default Rectangle;
