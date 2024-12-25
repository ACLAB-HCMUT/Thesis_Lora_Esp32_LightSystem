import { useEffect, useState } from "react";
import "./ToggleButton.css";
import { configAxios } from "../../config/axios";
import { useDispatch } from "react-redux";
import { updateDeviceStatus } from "../../redux/slice/app/socketSlice";
const ToggleButton = (props: { status: boolean; deviceID: string }) => {
  const [isToggle, setToggle] = useState<boolean>(props.status);
  const dispatch = useDispatch();
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
      dispatch(
        updateDeviceStatus({
          device_id: props.deviceID,
          status: newToggleState,
        })
      );
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
