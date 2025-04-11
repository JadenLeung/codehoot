import React, { useEffect } from 'react';
import Editor from '@monaco-editor/react';
import './Form.css';

function Form({ setCode, code, question }) {
  useEffect(() => {
    const fetchCode = async () => {
      try {
        if (question) {
          let res = await fetch(`http://127.0.0.1:5004/code?question=${question}`);
          let data = await res.json();
          setCode(data.code);
        }
      } catch (err) {
        console.error("Failed to fetch code:", err);
        setCode("// Failed to load starter code");
      }
    };
  
    fetchCode(); // run it
  
  }, [question]);
  
  

  return (
    <div className="Form">
      <Editor
        height="400px"
        defaultLanguage="c"
        value={code}
        onChange={(val) => setCode(val)}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          renderValidationDecorations: 'off'
        }}
      />
    </div>
  );
}

export default Form;
