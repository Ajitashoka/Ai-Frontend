"use client"; 
import React, { useState, useEffect } from 'react';
import Typewriter from 'typewriter-effect';
import Home from "../Home/Home";
import "./main.css";
import axios from "axios";

const Main = () => {
  const [loading, setLoading] = useState(true);
  const [inputdata, setInputdata] = useState(true);
  const [selectedGender, setSelectedGender] = useState(''); 
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  // Use useEffect to handle the loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 7000);

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  const handleNextClick = () => {
    if (name && age && weight && selectedGender) {
      setInputdata(false);
    } else {
      alert("Please fill out all fields.");
    }
  };


  return (
    <div className="container">
      {loading ? (
        <div style={{ paddingTop: "16rem" ,backgroundColor:"rgb(245, 245, 245)"}}>
          <Typewriter
            onInit={(typewriter) => {
              typewriter.typeString('Hi, This is your virtual doctor!')
                .callFunction(() => {
                  console.log('String typed out!');
                })
                .pauseFor(4000)
                .deleteAll()
                .callFunction(() => {
                  console.log('All strings were deleted');
                })
                .start();
            }}
          />
        </div>
      ) : (
        <>
          {inputdata ? (
            <div className="container-inner">
              <div className="gender">
                <button
                  className={selectedGender === 'Male' ? "button selected" : "button"}
                  onClick={() => setSelectedGender('Male')}
                >
                  Male
                </button>
                <button
                  className={selectedGender === 'Female' ? "button selected" : "button"}
                  onClick={() => setSelectedGender('Female')}
                >
                  Female
                </button>
              </div>
              <input
                className="input"
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="input"
                type="number"
                placeholder="Your Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
              <input
                className="input"
                type="number"
                placeholder="Your body weight in Kg"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
              <input
                className="input"
                type="number"
                placeholder="Your Height in cm"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
              <button className="button" onClick={handleNextClick}>
                Next
              </button>
            </div>
          ) : (
            <Home  age={age} height={height} weight={weight} selectedGender={selectedGender} />
          )}
        </>
      )}
    </div>
  );
};

export default Main;
