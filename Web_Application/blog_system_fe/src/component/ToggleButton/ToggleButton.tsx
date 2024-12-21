import { useState } from "react";
import "./ToggleButton.css";
import { configAxios } from "../../config/axios";
const ToggleButton = (props: { status: string; deviceID: string }) => {
  const [isToggle, setToggle] = useState<boolean>(
    props.status === "1" ? true : false
  );
  const handleToggleButton = async () => {
    const newToggleState = !isToggle;
    setToggle(newToggleState);
    const response = await configAxios.post("/led/led_status", {
      status: newToggleState ? "1" : "0",
      device_id: props.deviceID,
    });
  };
  return (
    <>
      <button
        className={`toggle-btn ${isToggle ? "toggled" : ""}`}
        onClick={handleToggleButton}
      >
        <div className="thumb"></div>
      </button>
    </>
  );
};

export default ToggleButton;
