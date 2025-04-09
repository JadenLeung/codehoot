import React from 'react';
import './Output.css';

function Output({output}) {

    function formattedOutput(text) {
      if (!text) {
        return "";
      }

      return text.split('\n').map((line) => (
        <div style = {{color: `${output.hasOwnProperty("error") ? "white" : output.hasOwnProperty("incorrect") && output["incorrect"] == 0 ? "#99FF9D" : "white"}`}}>
            {line}
            <br />
        </div>
      ));
    }

  return (
    <div>
        <p className="output-text">{output.state ? output.state : output.hasOwnProperty("error") 
                                ?  formattedOutput(output.error + "\n" + output.details) : formattedOutput(output.output)}</p>
    </div>
  );
}

export default Output;
