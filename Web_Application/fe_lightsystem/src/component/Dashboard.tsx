import { io } from "socket.io-client";
import { useEffect, useState } from "react";
const socket = io("http://localhost:3000", {
  reconnection: false,
});

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

  const turnOfLed = () => {
    console.log("turn of");
    socket.emit("subtopic", {
      subtopic: "turnOff",
      message: "Turn Off",
    });
  };
  const turnOnLed = () => {
    console.log("turn on");
    socket.emit("subtopic", {
      subtopic: "turnOn",
      message: "Turn On",
    });
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
