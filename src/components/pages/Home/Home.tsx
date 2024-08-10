"use client"
import React from 'react';
import { FaHeartPulse } from "react-icons/fa6";
import { MdBloodtype } from "react-icons/md";
import { FaTemperatureHigh } from "react-icons/fa6";
import { BiSolidDonateBlood } from "react-icons/bi";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import "./home.css";

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const Home = () => {
  return (
    <div className="home-container">
        <div className="sidepannel">
        </div>
        <div className="home-container-left">
            <div className="vital-container">
                <div className="vitals" style={{backgroundColor:"pink"}}>
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
        </div>
        <div className="home-container-right">
            <div className="health-status">
            <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={500}
          height={400}
          data={data}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="uv" stackId="1" stroke="#8884d8" fill="#8884d8" />
          <Area type="monotone" dataKey="pv" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
          <Area type="monotone" dataKey="amt" stackId="1" stroke="#ffc658" fill="#ffc658" />
        </AreaChart>
      </ResponsiveContainer>

            </div>
        </div>
    </div>
  )
}

export default Home