import React, { useState } from "react";
import "./ToggleButton.css";

const ToggleButton = (props: any) => {
  const [isToggle, setToggle] = useState<boolean>(false);

  const handleToggleButton = () => {
    setToggle(!isToggle);
    console.log(props, "check props");
    console.log("state", !isToggle);
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
