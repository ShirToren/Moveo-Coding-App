import "../index.css";
import { useEffect, useState, useCallback } from "react";
import throttle from "lodash.throttle";
import { useRef } from "react";
import { Editor } from "@monaco-editor/react";
import useWebSocket from "react-use-websocket";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "highlight.js/styles/default.css";

export default function CodeBlockPage() {
  const { id } = useParams();
  const location = useLocation();
  const { data } = location.state || {};
  const [textValue, setTextValue] = useState(data.code);
  const [role, setRole] = useState(null);
  const [numOfStudents, setNumOfStudents] = useState(0);
  const [showSmiley, setShowSmiley] = useState(false);

  const WS_URL = `wss://moveo-coding-server-production.up.railway.app?roomid=${id}`;
  const navigate = useNavigate();

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL);

  useEffect(() => {
    //when the client is entering the room, send a connect message to the socket
    sendJsonMessage({
      type: "connect",
      data: {
        id: id,
      },
    });
  }, [id, sendJsonMessage]);

  const handleLeavingRoom = useCallback(() => {
    sendJsonMessage({
      type: "exit", //exit
      data: {
        id: id,
        isAdmin: role === "Admin" ? true : false,
      },
    });
    navigate("/lobby");
  }, [id, navigate, role, sendJsonMessage]);

  useEffect(() => {
    if (lastJsonMessage) {
      if (lastJsonMessage.type === "connect") {
        const isAdmin = lastJsonMessage.data.isAdmin;
        if (isAdmin) {
          setRole("Admin");
        } else {
          setRole("Student");
        }
      } else if (lastJsonMessage.type === "codeUpdate") {
        const user = lastJsonMessage.data;
        if (user.state.id === id) {
          setTextValue(user.state.code);
        }
      } else if (lastJsonMessage.type === "clientUpdate") {
        setNumOfStudents(lastJsonMessage.data[id - 1]);
      } else if (
        lastJsonMessage.type === "exitAll" &&
        lastJsonMessage.data === id
      ) {
        handleLeavingRoom();
      }
    }
  }, [lastJsonMessage, id, handleLeavingRoom]);

  const handleCodeChange = (value, event) => {
    if (role !== "Admin") {
      setTextValue(value);
      setShowSmiley(value === data.solution);
      sendJsonMessageThrottle.current({
        type: "codeUpdate",
        data: {
          code: value,
          title: data.title,
          id: id,
        },
      });
    }
  };

  const THROTTLE = 100;
  const sendJsonMessageThrottle = useRef(throttle(sendJsonMessage, THROTTLE));

  const renderSmiley = () => {
    if (role === "Student" && showSmiley) {
      return <div className="smiley">Good Job!😊</div>;
    }
    return null;
  };

  return (
    <div className="container">
      <Header title={data.title} />
      <Editor
        height="300px"
        width="600px"
        theme="vs-dark"
        defaultLanguage="javascript"
        value={textValue}
        options={{ readOnly: role === "Admin" ? true : false }}
        onChange={handleCodeChange}
      ></Editor>
      {renderSmiley()}
      <h1 className="role">Role: {role === "Admin" ? "Mentor" : "Student"}</h1>
      <h1 className="students">Students in the room: {numOfStudents}</h1>
      <button className="btn" onClick={handleLeavingRoom}>
        Back to lobby
      </button>
    </div>
  );
}

function Header(props) {
  return (
    <header className="second-header">
      <h1>{props.title}</h1>
    </header>
  );
}
