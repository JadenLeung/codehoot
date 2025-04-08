import React, {useEffect} from 'react';
import './Output.css';

function Output({output}) {

    const formattedOutput = output.split('\n').map((line, index) => (
        <React.Fragment key={index}>
          {line}
          <br />
        </React.Fragment>
      ));

  return (
    <div>
        <p className="output-text">{formattedOutput}</p>
    </div>
  );
}

export default Output;
