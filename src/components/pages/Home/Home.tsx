"use client"
import React, { useState } from 'react';
import { FaHeartPulse } from "react-icons/fa6";
import { MdBloodtype } from "react-icons/md";
import { FaTemperatureHigh } from "react-icons/fa";
import { BiSolidDonateBlood } from "react-icons/bi";
import { SiSamsung } from "react-icons/si";
import { FaApple, FaGoogle } from "react-icons/fa";
import Medical from '../Medical/Medical';
import Bot from "../Bot/Bot";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import "./home.css";

// Type for the vitals state
interface Vitals {
  steps: number;
  heartminute: number;
  calories: number;
  activeminutes: number;
}

// Sample data for the chart
const data = [
  { name: "-30", uv: 4000, pv: 2400, amt: 2400 },
  { name: "-20", uv: 3000, pv: 1398, amt: 2210 },
  { name: "-10", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Current", uv: 2780, pv: 3908, amt: 2000 },
  { name: "10", uv: 1890, pv: 4800, amt: 2181 },
  { name: "20", uv: 2390, pv: 3800, amt: 2500 },
  { name: "30", uv: 3490, pv: 4300, amt: 2100 },
];

const Home: React.FC = () => {
  const [token, setToken] = useState<string>("");
  const [userdata, setUserdata] = useState<any>(null);

  const [vitals, setVitals] = useState<Vitals>({
    steps: 0,
    heartminute: 0,
    calories: 0,
    activeminutes: 0
  });

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        setUserdata(userInfo.data);
        setSignin(true);
        console.log('User Info:', userInfo.data);
        setToken(tokenResponse.access_token);
        fetchGoogleFitData(tokenResponse.access_token);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    },
    scope: process.env.REACT_APP_GOOGLE_FIT_SCOPES,
  });

  const fetchGoogleFitData = async (accessToken: string) => {
    try {
      const response = await axios.post(
        'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
        {
          aggregateBy: [
            { dataTypeName: 'com.google.step_count.delta' },
            { dataTypeName: 'com.google.calories.expended' },
            { dataTypeName: 'com.google.heart_minutes' },
            { dataTypeName: 'com.google.active_minutes' }
          ],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis: Date.now() - 7 * 24 * 60 * 60 * 1000, 
          endTimeMillis: Date.now(),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log('Google Fit Data:', response.data);

      const newVitals: Partial<Vitals> = {};

      response.data.bucket.forEach((bucket: any) => {
        bucket.dataset.forEach((dataset: any) => {
          dataset.point.forEach((point: any) => {
            const dataType = dataset.point[0]?.dataTypeName;

            if (dataType === 'com.google.step_count.delta') {
              newVitals.steps = point.value[0]?.intVal || 0;
            } else if (dataType === 'com.google.calories.expended') {
              newVitals.calories = point.value[0]?.fpVal || 0;
            } else if (dataType === 'com.google.heart_minutes') {
              newVitals.heartminute = point.value[0]?.fpVal || 0;
            } else if (dataType === 'com.google.active_minutes') {
              newVitals.activeminutes = point.value[0]?.intVal || 0;
            }
          });
        });
      });

      setVitals((prevVitals) => ({
        ...prevVitals,
        ...newVitals
      }));
      
    } catch (error) {
      console.error('Error fetching Google Fit data:', error);
    }
  };

  const [signin, setSignin] = useState<boolean>(false);
  const [livedata, setLivedata] = useState<boolean>(true);
  const [mhistory, setMhistory] = useState<boolean>(false);
  const [chatbot, setChatbot] = useState<boolean>(false);
  const [active, setActive] = useState<number>(0);

  return (
    <div className="home-container">
      <div className="sidepannel">
        <div onClick={() => {
          setChatbot(false);
          setLivedata(true);
          setMhistory(false);
          setActive(0);
        }} className={active === 0 ? "option-buttons active" : "option-buttons"}>
          Live Data
        </div>
        <div onClick={() => {
          setChatbot(false);
          setLivedata(false);
          setMhistory(true);
          setActive(1);
        }} className={active === 1 ? "option-buttons active" : "option-buttons"}>
          Medical History
        </div>
        <div onClick={() => {
          setChatbot(true);
          setLivedata(false);
          setMhistory(false);
          setActive(2);
        }} className={active === 2 ? "option-buttons active" : "option-buttons"}>
          Chat Bot
        </div>
      </div>

      {active === 0 ? (
        <>
          {signin? (
            <div className="container-toggle">
              <div className="home-container-left">
                <div className="vital-container">
                  <div className="vitals" style={{ backgroundColor: "pink" }}>
                    <FaHeartPulse className="icons" style={{ backgroundColor: "pink", color: "C80036", marginBottom: "0.5rem" }} />
                    <p style={{ backgroundColor: "pink", fontSize: "12px", marginBottom: "1rem" }}>Heart Rate</p>
                    <p style={{ backgroundColor: "pink" }}>{vitals.heartminute} bpm</p>
                  </div>
                  <div className="vitals" style={{ backgroundColor: "#CDFADB" }}>
                    <BiSolidDonateBlood className='icons' style={{ backgroundColor: "#CDFADB", color: "219C90", marginBottom: "0.5rem" }} />
                    <p style={{ backgroundColor: "#CDFADB", fontSize: "12px", marginBottom: "1rem" }}>SpO2 Level</p>
                    <p style={{ backgroundColor: "#CDFADB" }}>--</p>
                  </div>
                </div>
                <div className="vital-container">
                  <div className="vitals" style={{ backgroundColor: "#FFEEAD" }}>
                    <FaTemperatureHigh className="icons" style={{ backgroundColor: "#FFEEAD", color: "FFAD60", marginBottom: "0.5rem" }} />
                    <p style={{ backgroundColor: "#FFEEAD", fontSize: "12px", marginBottom: "1rem" }}>Body Temperature</p>
                    <p style={{ backgroundColor: "#FFEEAD" }}>--&deg;F</p>
                  </div>
                  <div className="vitals" style={{ backgroundColor: "#B9FFF8" }}>
                    <MdBloodtype className='icons' style={{ backgroundColor: "#B9FFF8", color: "31C6D4", marginBottom: "0.5rem" }} />
                    <p style={{ backgroundColor: "#B9FFF8", fontSize: "12px", marginBottom: "1rem" }}>Blood Pressure</p>
                    <p style={{ backgroundColor: "#B9FFF8" }}>--/-- mm Hg</p>
                  </div>
                </div>
                <div className="preventive-measures">
                  <h3 style={{ paddingBottom: "1rem" }}>Preventive Measures</h3>
                  <ul>
                    <li>Drink warm water every morning.</li>
                    <li>Go for 30 minutes walk everyday.</li>
                    <li>Drink more water.</li>
                    <li>Sleep for at least 8 hours.</li>
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
                    <XAxis style={{ fontSize: "12px" }} dataKey="name" />
                    <YAxis style={{ fontSize: "12px" }} dataKey="pv" />
                    <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
                  </AreaChart>
                </div>
              </div>
            </div>
          ) : (
            <div className="container-toggle">
              <div className="signin-google">
                <p>SignIn with Google Fit</p>
                <div className="google-signin-button" onClick={() => login()}>
                  <FaGoogle style={{ background: "transparent", fontSize: "1.2rem", color: "red" }} />
                  <p>Sign in with Google</p>
                </div>
              </div>
              <div className="signin-google">
                <p>SignIn with Apple Health</p>
                <div className="google-signin-button">
                  <FaApple style={{ background: "transparent", fontSize: "1.2rem", color: "silver" }} />
                  <p>Sign in with Apple</p>
                </div>
              </div>
              <div className="signin-google">
                <p>SignIn with Samsung Fit</p>
                <div className="google-signin-button">
                  <SiSamsung style={{ background: "transparent", fontSize: "1.2rem", color: "black" }} />
                  <p>Sign in with Samsung</p>
                </div>
              </div>
            </div>
          )}
        </>
      ) : active === 1 ? (
        <div className="container-toggle">
          <Medical />
        </div>
      ) : (
        <div className="container-toggle">
          <Bot />
        </div>
      )}
    </div>
  );
};

export default Home;
