import React from 'react';
import './Output.css';

function Output({output}) {

    const formattedOutput = output.split('\n').map((line, index) => (
        <>
            {line}
            <br />
        </>
      ));

  return (
    <div>
        <p className="output-text">{formattedOutput}</p>
    </div>
  );
}

export default Output;
