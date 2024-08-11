"use client"
import React, {useState} from 'react';
import { FaHeartPulse } from "react-icons/fa6";
import { MdBloodtype } from "react-icons/md";
import { FaTemperatureHigh } from "react-icons/fa6";
import { BiSolidDonateBlood } from "react-icons/bi";
import Bot from "../Bot/Bot"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import "./home.css";

const data = [
{
  name: "-30",
  uv: 4000,
  pv: 2400,
  amt: 2400,
},
{
  name: "-20",
  uv: 3000,
  pv: 1398,
  amt: 2210,
},
{
  name: "-10",
  uv: 2000,
  pv: 9800,
  amt: 2290,
},
{
  name: "Current",
  uv: 2780,
  pv: 3908,
  amt: 2000,
},
{
  name: "10",
  uv: 1890,
  pv: 4800,
  amt: 2181,
},
{
  name: "20",
  uv: 2390,
  pv: 3800,
  amt: 2500,
},
{
  name: "30",
  uv: 3490,
  pv: 4300,
  amt: 2100,
},
];

const Home = () => {
  const [livedata,setLivedata] = useState(true);
  const [mhistory,setMhistory] = useState(false);
  const [chatbot,setChatbot] = useState(false);
  const [active,setActive] = useState(0);
  return (
    <div className="home-container">
        <div className="sidepannel">
          <div onClick={()=>{
            setChatbot(false);
            setLivedata(true);
            setMhistory(false);
            setActive(0);
          }} className= {active===0?"option-buttons active":"option-buttons"}>Live Data</div>
          <div onClick={()=>{
            setChatbot(false);
            setLivedata(false);
            setMhistory(true);
            setActive(1);
          }} className={active===1?"option-buttons active":"option-buttons"}>Medical History</div>
          <div onClick={()=>{
            setChatbot(true);
            setLivedata(false);
            setMhistory(false);
            setActive(2);
          }} className={active===2?"option-buttons active":"option-buttons"}>Chat Bot</div>
        </div>
        {active===0?<>     
        <div className="container-toggle"> 
        <div className="home-container-left">
            <div className="vital-container">
                <div  className="vitals" style={{backgroundColor:"pink"}}>
                    <FaHeartPulse className="icons"  style={{backgroundColor:"pink",color:"C80036",marginBottom:"0.5rem"}}/>
                    <p style={{backgroundColor:"pink",fontSize:"12px",marginBottom:"1rem"}}>  Heart Rate</p>
                    <p style={{backgroundColor:"pink"}}>70</p>
                </div>
                <div className="vitals" style={{backgroundColor:"#CDFADB"}}>
                    <BiSolidDonateBlood className='icons'  style={{backgroundColor:"#CDFADB" , color:"219C90",marginBottom:"0.5rem"} }/>
                    <p style={{backgroundColor:"#CDFADB",fontSize:"12px",marginBottom:"1rem"}}>SpO2 Level</p>
                    <p style={{backgroundColor:"#CDFADB"}}>98</p>
                </div>
            </div>
            <div className="vital-container">
            <div className="vitals" style={{backgroundColor:"#FFEEAD"}}>
                    <FaTemperatureHigh className="icons"  style={{backgroundColor:"#FFEEAD",color:"FFAD60",marginBottom:"0.5rem"}}/>
                    <p style={{backgroundColor:"#FFEEAD",fontSize:"12px",marginBottom:"1rem"}}>  Body Temperature</p>
                    <p style={{backgroundColor:"#FFEEAD"}}>96&deg;F</p>
                </div>
                <div className="vitals" style={{backgroundColor:"#B9FFF8"}}>
                    <MdBloodtype className='icons'  style={{backgroundColor:"#B9FFF8" , color:"31C6D4",marginBottom:"0.5rem"} }/>
                    <p style={{backgroundColor:"#B9FFF8",fontSize:"12px",marginBottom:"1rem"}}>Blood Pressure</p>
                    <p style={{backgroundColor:"#B9FFF8"}}>180/120 mm Hg</p>
                </div>
            </div>
            <div className="preventive-measures">
              <h3 style={{paddingBottom:"1rem"}}>Preventive Measures</h3>
              <ul>
        <li>Drink warm water every morning.</li>
        <li>Go for 30 minutes walk everyday.</li>
        <li>Drink more water.</li>
        <li>Sleep for atleast 8 hours.</li>
        <li>No Smoking.</li>
    </ul>
            </div>
        </div>
        <div className="home-container-right">
            <div className="health-status">
            <AreaChart
      width={480}
      height={300}
      data={data}
      margin={{
        top: 30,
        right: 30,
        left: 0,
        bottom: 0,
      }}
    >
      
      <XAxis style={{fontSize:"12px"}} dataKey="name" />
      <YAxis style={{fontSize:"12px"}}  dataKey="pv"/>
      {/* <Tooltip /> */}
      <Area  type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
         </div>
        </div>
        </div>  </>:active===1?<>
        <div className="container-toggle"> 
          </div>
        </>:<>
        <div className="container-toggle"> 
          <Bot/>
        </div>
        </>}
    </div>
  )
}

export default Home