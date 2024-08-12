"use client";

import { useState, ChangeEvent, useEffect } from 'react';
import "./medical.css";
import axios from "axios";
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'; 

const Medical: React.FC = () => {
  const [output, setOutput] = useState<string>('');
  const [file, setFile] = useState<File | null>(null); // Changed from any to File | null
  const [uploaded, setUploaded] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploaded(true);
    }
  };

  useEffect(() => {
    if (file !== null) {
      getHealthReport(file);
    }
  }, [uploaded]);

  async function getHealthReport(file: File) {
    const url = "http://localhost:8000/process/";
    try {
      const formData = new FormData();
      formData.append('other_file', file);
      formData.append('data_type',"file")
      
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log("beforeset", response.data.processed_text);
      console.log("wegotoutput", response.data.processed_text.response);
      
    } catch (error) {
      console.error("error", error);
    }
  }
  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  return (
    <>
    <div className="container-medical">
      <div className="file-input-container">
        <h1 className="heading">Upload your Medical Report</h1>
        <input
          type="file"
          id="file-input"
          className="file-input"
          onChange={handleFileChange}
        />
        <label htmlFor="file-input" className="file-input-label">
          Choose file
        </label>
        
      </div>
    </div>
{/* 
<div>
<Document
  file={file}
  onLoadSuccess={onDocumentLoadSuccess}
>
  {Array.from(new Array(numPages), (el, index) => (
    <Page
      key={index}
      pageNumber={index + 1}
    />
  ))}
</Document>
</div> */}
</>
  );
};

export default Medical;
