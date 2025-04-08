import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import './Form.css';

function Form({setCode, code}) {

  useEffect(() => {
    fetch('/data/startercode.c')
      .then((res) => res.text())
      .then((text) => setCode(text))
      .catch((err) => {
        console.error("Failed to load starter code:", err);
        setCode("// Failed to load starter code");
      });
  }, []);

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
