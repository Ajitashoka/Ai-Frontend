"use client";
import { useState, ChangeEvent } from 'react';
import "./medical.css";

const Medical: React.FC = () => {
  const [report, setReport] = useState<string>('');
  const [output, setOutput] = useState<string>('');

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newReport = e.target.value;
    setReport(newReport);
    setOutput(`Processed report: ${newReport}`);
  };

  return (
    <div className="container">
      <h1 className="heading">Medical Report Input</h1>
      <textarea
        className="textarea"
        placeholder="Type your medical report here..."
        value={report}
        onChange={handleTextChange}
        rows={10}
        cols={50}
      />
      <h2 className="outputHeading">Processed Report Output</h2>
      <textarea
        className="readOnlyTextarea"  // Fixed className
        value={output}
        readOnly
        rows={10}
        cols={50}
      />
    </div>
  );
};

export default Medical;
