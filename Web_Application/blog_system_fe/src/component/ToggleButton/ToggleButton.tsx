import { useEffect, useState } from "react";
import "./ToggleButton.css";
import { configAxios } from "../../config/axios";

const ToggleButton = (props: { status: boolean; deviceID: string }) => {
  const [isToggle, setToggle] = useState<boolean>(props.status);

  useEffect(() => {
    // Ensure the state updates correctly when props.status changes
    setToggle(props.status);
  }, [props.status]);

  const handleToggleButton = async () => {
    const newToggleState = !isToggle;
    setToggle(newToggleState);

    try {
      await configAxios.post("/led/led_status", {
        status: newToggleState ? true : false,
        device_id: props.deviceID,
      });
    } catch (error) {
      console.error("Failed to update toggle status:", error);
      setToggle(!newToggleState);
    }
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
