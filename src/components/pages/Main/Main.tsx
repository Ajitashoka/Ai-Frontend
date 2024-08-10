"use client"
import React ,{useState} from 'react'
import Home from "../Home/Home"
import "./main.css"
const Main = () => {
  const [loading,setLoading] = useState(true);
  const [inputdata,setInputdata] = useState(true);
  setTimeout(() => {
    setLoading(false)
  }, 2000); 
  return (
    <>
      <div className="container">
        {loading?<p>Hi, this is your virtual doctor!</p>:<>
          {inputdata?
          <div className="container-inner">
            <div className='gender'>
            <button className='button'>Male</button>
            <button className='button'>Female</button>
            </div>
             <input className="input" type="text" placeholder='Your Name' /> 
             <input className="input" type="number" placeholder='Your Age' /> 
             <input className="input" type="number" placeholder='Your body weight' /> 
             <button className='button' onClick={()=>setInputdata(false)}>Next</button>
          </div>
          :<>
            <Home/>
          </>}
        </>}
      </div>
    </>
  )
}

export default Main
