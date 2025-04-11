import React, { useEffect } from 'react';
import Editor from '@monaco-editor/react';
import './Form.css';

function Form({ setCode, code, question, width, file }) {
  useEffect(() => {
  
    fetchCode(); // run it
  
  }, [question]);

  const fetchCode = async () => {
    try {
      if (question) {
        let res = await fetch(`http://127.0.0.1:5004/code?question=${question}`);
        let data = await res.json();
        setCode(data);
      }
    } catch (err) {
      console.error("Failed to fetch code:", err);
      const error = `// Failed to load starter code\n// ${err}`;
      setCode({code: error, in: error, expect: error})
    }
  };
  
  

  return (
    <div className="Form">
      <Editor
        height="500px"
        width={width}
        defaultLanguage="c"
        value={file == "main.c" ? code.code : file == "public.in" ? code.in : code.expect}
        onChange={(val) => setCode(prev => ({...prev, code: val}))}
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
