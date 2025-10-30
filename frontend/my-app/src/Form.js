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
          setCode((prev) => {
            if (file === "main.c") return { ...prev, code: val };
            if (file === "public.in") return { ...prev, in: val };
            if (file === "public.expect") return { ...prev, expect: val };
            if (file === "solution.c") return { ...prev, solution: val };
            return prev;
          });
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
