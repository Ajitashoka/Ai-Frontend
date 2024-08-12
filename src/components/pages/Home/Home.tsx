"use client"
import React, { useState,useEffect } from 'react';
import { FaHeartPulse,FaPersonWalking } from "react-icons/fa6";
import { MdBloodtype } from "react-icons/md";
import { FaTemperatureHigh,FaFire } from "react-icons/fa";
import { BiSolidDonateBlood } from "react-icons/bi";
import { SiSamsung } from "react-icons/si";
import { FaApple, FaGoogle } from "react-icons/fa";
import { IoTime } from "react-icons/io5";
import { MdSportsMartialArts } from "react-icons/md";
import Medical from '../Medical/Medical';
import Bot from "../Bot/Bot";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { PieChart, Pie, Cell } from "recharts";
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

const Home: React.FC = ({age,height,weight,selectedGender}) => {
  const [res,setRes] = useState('')
  const [token, setToken] = useState<string>("");
  const [userdata, setUserdata] = useState<any>(null);

  const [vitals, setVitals] = useState<Vitals>({
    steps: 0,
    heartminute: 0,
    calories: 0,
    activeminutes: 0
  });
  useEffect(() => {
    let data = `Using the medical records and the below health parameters, what could be the preventive measures 
    taken for better health.
    'steps':${vitals.steps},
    'clories burned':${vitals.calories},
    'Heart minutes':${vitals.heartminute},
    'activity minutes':${vitals.activeminutes},
    'age in years':${age},
    'height in centimeters':${height},
    'weight in kiligrams':${weight},
    'Gender':${selectedGender}
  }
    '''. Act as a doctor and analyze the health factors associated with the patient from the provided information.
Return the response in HTML format and do not mention a text like "Here is your response in HTML'''.  
    `
    let data1 = "Using the medical reports and all historical data. Return a only integer value between 0 and 100"
    getHealthScore(data1);
    getHealthReport(data);
  }, [userdata])
  

  async function getHealthReport(data:string) {
    const url = "http://localhost:8000/process/";
    try {
      const formData = new FormData();
      formData.append("text_data", data)
      formData.append("data_type","text")
      
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log("beforeset", response.data.processed_text);
      console.log("wegotoutput", response.data.processed_text.response);
      setRes(response.data.processed_text.response)
    } catch (error) {
      console.error("error", error);
    }
  }

  async function getHealthScore(data:string) {
    const url = "http://localhost:8000/process/";
    try {
      const formData = new FormData();
      formData.append("text_data", data)
      formData.append("data_type","text")
      
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log("beforeset", response.data.processed_text);
      console.log("wegotoutput", response.data.processed_text.response);
      setScore(response.data.processed_text.response)
    } catch (error) {
      console.error("error", error);
    }
  }
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
            { dataTypeName: 'com.google.active_minutes' },
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
              console.log(newVitals.steps);
            } else if (dataType === 'com.google.calories.expended') {
              newVitals.calories = point.value[0]?.fpVal || 0;
            } else if (dataType === 'com.google.heart_minutes.summary') {
              newVitals.heartminute = point.value[0]?.fpVal || 0;
            } else if (dataType === 'com.google.active_minutes') {
              newVitals.activeminutes = point.value[0]?.intVal || 0;
            }
            else if(dataType=='com.google.blood_pressure')
            {
              console.log("sdasdd");
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
 const [score,setScore] = useState('0');
  const data = [
    { name: "Group A", value: 100-parseInt(score) },
    { name: "Group B", value: parseInt(score) },
  ];
  const COLORS = [ "#438AF61A","#179BAE"];

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
                  <div className="vitals" style={{ backgroundColor: "#E2BFD9" }}>
                    <FaPersonWalking className="icons" style={{ backgroundColor: "#E2BFD9", color: "674188", marginBottom: "0.5rem" }} />
                    <p style={{ backgroundColor: "#E2BFD9", fontSize: "12px", marginBottom: "1rem" }}>Steps</p>
                    <p style={{ backgroundColor: "#E2BFD9" }}>{vitals.steps}</p>
                  </div>
                  <div className="vitals" style={{ backgroundColor: "#EB5B00" }}>
                    <FaFire className='icons' style={{ backgroundColor: "#EB5B00", color: "B43F3F", marginBottom: "0.5rem" }} />
                    <p style={{ backgroundColor: "#EB5B00", fontSize: "12px", marginBottom: "1rem" }}>Calories</p>
                    <p style={{ backgroundColor: "#EB5B00" }}>{parseInt(`${vitals.calories}`, 10)}</p>
                  </div>
                </div>
                <div className="vital-container">
                  <div className="vitals" style={{ backgroundColor: "#FFC470" }}>
                    <IoTime className="icons" style={{ backgroundColor: "#FFC470", color: "DD5746", marginBottom: "0.5rem" }} />
                    <p style={{ backgroundColor: "#FFC470", fontSize: "12px", marginBottom: "1rem" }}>Heart Minutes</p>
                    <p style={{ backgroundColor: "#FFC470" }}>{vitals.heartminute}</p>
                  </div>
                  <div className="vitals" style={{ backgroundColor: "#5B99C2" }}>
                    <MdSportsMartialArts className='icons' style={{ backgroundColor: "#5B99C2", color: "021526", marginBottom: "0.5rem" }} />
                    <p style={{ backgroundColor: "#5B99C2", fontSize: "12px", marginBottom: "1rem" }}>Active Minutes</p>
                    <p style={{ backgroundColor: "#5B99C2" }}>{vitals.activeminutes}</p>
                  </div>
                </div>
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
                
              </div>
              <div className="home-container-right">
                <div className="health-status">
                  {/* <AreaChart
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
                  </AreaChart> */}
                  <div
        style={{
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
        }}
      >
        <PieChart width={250} height={250}>
          <Pie data={data} innerRadius={60} outerRadius={90} dataKey="value">
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
              
            ))}
            
          </Pie>
        </PieChart>
        <div className="score" style={{  position: "absolute" }}>{score}</div>
        <div className="score" style={{fontSize:"0.8rem",  position: "absolute",marginTop:"2rem" }}>Health Score</div>
        
      </div>
                </div>
                <div className="preventive-measures">
                 
                  <div dangerouslySetInnerHTML={{ __html: res }} />
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
