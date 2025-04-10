import React, { useEffect } from 'react';
import Editor from '@monaco-editor/react';
import './Form.css';

function Form({ setCode, code, question }) {
  useEffect(() => {
    if (question) {
      fetch(`http://127.0.0.1:5004/code?question=${question}`)
      .then((res) => res.text())
      .then((text) => setCode(text))
      .catch((err) => {
        console.error("Failed to load starter code:", err);
        setCode("// Failed to load starter code");
      });
    }
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
