import React, { useEffect } from 'react';
import Editor from '@monaco-editor/react';
import './Form.css';

function Form({ setCode, code, question, width, file, fetchCode, height }) {
  useEffect(() => {
  
    fetchCode(); // run it
  
  }, [question]);

  const fileobj = {
    "main.c": code.code,
    "public.in": code.in,
    "public.expect": code.expect,
    "solution.c": code.solution,
  }
  
  return (
    <div className="Form">
      <Editor
        height={height}
        width={width}
        defaultLanguage="c"
        value={fileobj[file]}
        onChange={(val) => {
          if (file === "main.c") {
            setCode(prev => ({ ...prev, code: val }));
          }
        }}
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
