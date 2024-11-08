import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import axiosConfig from "../config/axiosConfig";
const socket = io("http://localhost:3000", {
  reconnection: false,
});

// {
//   "light_sensor_value": "80",
//   "status": false,
//   "deviceID": 3,
//   "timestamp": "2024-10-10T14:58:27+0700"
// }
const Dashboard = () => {
  const [message, setMessage] = useState<{
    topic: string;
    message: string;
  } | null>(null);

  // message is a namespace of socket.io, not a topic in AWS IOT
  useEffect(() => {
    socket.on("message", (data: any) => {
      console.log(data, "Received message");
      if (typeof data === "object" && data.topic && data.message) {
        setMessage({ topic: data.topic, message: data.message });
      } else {
        console.error("Received data format is incorrect");
      }
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const turnOfLed = async () => {
    // console.log("turn of");
    // socket.emit("subtopic", {
    //   subtopic: "turnOff",
    //   message: "Turn Off",
    // });
    await axiosConfig.post("/light/turnOff");
  };
  const turnOnLed = async () => {
    // console.log("turn on");
    // socket.emit("subtopic", {
    //   subtopic: "turnOn",
    //   message: "Turn On",
    // });
    await axiosConfig.post("/light/turnOn");
  };
  return (
    <div>
      <h1>Real-time IoT Data</h1>
      {message ? (
        <div>
          <p>Topic: {message.topic}</p>
          <p>Message: {message.message}</p>
        </div>
      ) : (
        <p>No data received yet...</p>
      )}
      <div className="button-group">
        <button onClick={turnOnLed}>Turn On</button>
        <button onClick={turnOfLed}>Turn Off</button>
      </div>
    </div>
  );
};

export default Dashboard;
