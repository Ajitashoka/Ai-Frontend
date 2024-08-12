"use client"
/* eslint-disable react/prop-types */
import React, { useRef,useEffect, useState, useLayoutEffect, ChangeEvent, MouseEvent } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCircleArrowUp, FaArrowUp } from "react-icons/fa6";
import { FaMicrophone, FaStop, FaPlay, FaPause } from "react-icons/fa";
import { LuUpload } from "react-icons/lu";
import { useReactMediaRecorder } from "react-media-recorder";
import axios from "axios";
import base64 from "base64-js";
import "./input.css";

// Define types for props
interface InputProps {
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  setIsloading: React.Dispatch<React.SetStateAction<boolean>>;
}

// Define types for the current value
interface CurrentValue {
  currentuser: string;
  message: string;
}

const Input: React.FC<InputProps> = ({ setMessages, setIsloading }) => {
  // switching text and audio input
  const [inputistext, setInputistext] = useState<boolean>(true);
  let audiot: string = "";
  // audio controls
  const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ audio: true });

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Current input value
  const [currentvalue, setCurrentvalue] = useState<CurrentValue>({
    currentuser: "Speaker",
    message: "",
  });
  const [messageinput, setMessageinput] = useState<CurrentValue[]>([]);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [usercount, setUsercount] = useState<number>(0);
  const [usercountemp, setUsercountemp] = useState<number>(0);
  const [audioinput, setAudioinput] = useState<string | null>(null);

  const [options, setOptions] = useState<any[]>([]);

  // Input control functions

  // Audio Input control functions
  const addFile = (e: ChangeEvent<HTMLInputElement>) => {
    const tempfile = e.target.files?.[0];
    if (tempfile) {
      const blob = new Blob([tempfile], { type: "audio/wav" });
      const blobUrl = URL.createObjectURL(blob);
      setAudioinput(blobUrl);
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (status === "stopped") {
      setAudioinput(mediaBlobUrl);
    }
  }, [mediaBlobUrl, status]);

  // Dynamically increasing height of input tag
  const textbox = useRef<HTMLTextAreaElement | null>(null);
  function adjustHeight() {
    if (textbox.current) {
      textbox.current.style.height = "inherit";
      textbox.current.style.height = `${textbox.current.scrollHeight}px`;
    }
  }

  useLayoutEffect(adjustHeight, []);
  function handleKeyDown() {
    adjustHeight();
  }

  // Handling input change events

  // Text input
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  function handletextsubmit() {
    if (currentvalue.message.length === 0) {
      toast.warning("Text field can't be empty", {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          isUser: true,
          input: "text",
          text: [{ currentuser: "Speaker", message: currentvalue.message }],
        },
      ]);
      audiot = `${currentvalue.currentuser}:${currentvalue.message}`;
      setCurrentvalue({
        currentuser: currentvalue.currentuser,
        message: "",
      });
      if (textbox.current) {
        textbox.current.style.height = "2rem";
      }

      getsentimentanalysis("TEXT");
    }
  }

  function submittextstring() {
    // call api from here
    let messageString = "";
    for (const item of messageinput) {
      messageString += `${item.currentuser}:${item.message}\n\n`;
    }
    audiot = messageString;
    getsentimentanalysis("TEXT");
  }

  // api calls

 
  // api call middleware
  function setoutput(input: any) {
    const lines = input.data.result.split(/\n{1,6}/);
    const dialogue = [];
    lines.forEach((line: string) => {
      const [speaker, value] = line.split(":");
      const trimmedSpeaker = speaker.trim();
      const trimmedMessage = value.trim();
      dialogue.push({ speaker: trimmedSpeaker, value: trimmedMessage });
    });
    return dialogue;
  }

  function removeNewlines(text) {
    // Use a regular expression to replace all newline characters with an empty string
    return text.replace(/\n/g, '');
  }
  // calling api
  async function getsentimentanalysis(type?: string) {
    console.log("mera naam bulla")
    if (type === "AUDIO" && audioinput) {
      audiot = base64.fromByteArray(new Uint8Array(await (await fetch(audioinput)).arrayBuffer()));
      setMessages((prevMessages) => [
        ...prevMessages,
        { isUser: true, input: "audio", playing: false, audio: audioinput },
      ]);
    }
    setIsloading(true);
    const formData = new FormData();
    formData.append("text_data", audiot + `'''. Act as a doctor and analyze the health factors associated with the patient from the provided information.
Return the response in HTML format and do not mention a text like "Here is your response in HTML'''.  `)
    formData.append("data_type","text")
    // const data = {
    //   text_data: audiot,
    //   data_type:"text"
    // };

    const url = "http://localhost:8000/process/";
    try {
      // console.log(data.text_data,typeof data) 
      const response = await axios.post(url, formData);
      console.log("beforeset",response.data.processed_text)
      const value = removeNewlines(response.data.processed_text.response)
      console.log("wegotoutput",response.data.processed_text.response);
      setMessages((prevMessages) => [
        ...prevMessages,
        { isUser: false, response: response.data.processed_text.response },
      ]);
      setIsloading(false);
      setAudioinput(null);
    } catch {
      setIsloading(false);
      setAudioinput(null);
      toast.error("Unable to Process!", {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }

  return (
    <>
      <ToastContainer />
      <div className="input-conatiner">
        {inputistext ? (
          <>
            <div style={{ display: "flex", flexDirection: "column-reverse" }}></div>
            <div className="input-main" style={isFocused ? { border: "1px solid rgb(141, 141, 141)" } : {}}>
              <textarea
                onFocus={handleFocus}
                onBlur={handleBlur}
                ref={textbox}
                rows={1}
                type="text"
                className="text-input"
                placeholder="Message your personalized doctor"
                value={currentvalue.message}
                onChange={(e) => {
                  setCurrentvalue({
                    currentuser: currentvalue.currentuser,
                    message: e.target.value,
                  });
                  handleKeyDown();
                }}
              />
              <div className="submit" onClick={handletextsubmit}>
                <FaCircleArrowUp style={{ cursor: "pointer", fontSize: "1.5rem", backgroundColor: "white" }} />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Audio Input */}
            <div style={{ display: "flex" }}>
              <label>
                <div className="audio-input">
                  <LuUpload style={{ backgroundColor: "white" }} />
                </div>
                <input
                  type="file"
                  onChange={addFile}
                  accept=".mp3,.flac,.m4a,.mp4,.wav,wma,.aac"
                  className="button"
                />
              </label>
              <div>
                {status === "idle" || status === "stopped" ? (
                  <div className="audio-input" onClick={startRecording}>
                    <FaMicrophone style={{ backgroundColor: "white" }} />
                  </div>
                ) : (
                  <div className="audio-input" onClick={stopRecording}>
                    <FaStop style={{ backgroundColor: "white" }} />
                  </div>
                )}
              </div>
            </div>
            <div>
              <audio ref={audioRef} src={audioinput ?? undefined} onEnded={handlePlayPause} />
              <div>
                {audioinput ? (
                  <>
                    {!isPlaying ? (
                      <div className="audio-input" onClick={handlePlayPause}>
                        <FaPlay style={{ backgroundColor: "white" }} />
                      </div>
                    ) : (
                      <div className="audio-input" onClick={handlePlayPause}>
                        <FaPause style={{ backgroundColor: "white" }} />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="audio-input" style={{ opacity: "0.5", cursor: "no-drop", backgroundColor: "white" }}>
                    <FaPlay style={{ backgroundColor: "white" }} />
                  </div>
                )}
              </div>
            </div>
            <div>
              {audioinput ? (
                <div className="audio-input" onClick={() => getsentimentanalysis("AUDIO")}>
                  <FaArrowUp style={{ backgroundColor: "white" }} />
                </div>
              ) : (
                <div className="audio-input" style={{ opacity: "0.5", cursor: "no-drop", backgroundColor: "white" }}>
                  <FaArrowUp style={{ backgroundColor: "white" }} />
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div
        className="input-buttons"
        style={{ bottom: "10%", position: "fixed", right: "2rem" }}
        onClick={() => setInputistext(!inputistext)}
      >
        {inputistext ? <>Switch to Audio</> : <>Switch to Text</>}
      </div>
    </>
  );
};

export default Input;
