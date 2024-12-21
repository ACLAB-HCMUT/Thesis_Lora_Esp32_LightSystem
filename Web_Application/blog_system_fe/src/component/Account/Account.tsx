import { useState } from "react";
import "./Account.css";
import SignIn from "../Signin/Signin";
import SignUp from "../Signup/Signup";
const Account = () => {
  const [type, setType] = useState<"signIn" | "signUp">("signIn");

  const handleOnClick = (text: "signIn" | "signUp") => {
    if (text !== type) {
      setType(text);
    }
  };

  const containerClass =
    "container " + (type === "signUp" ? "right-panel-active" : "");

  return (
    <div className="AccountApp">
      <div className={containerClass} id="container">
        {type === "signUp" ? <SignUp /> : <SignIn />}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              {/* <h1>Welcome Back!</h1>
              <p>
                To keep connected with us please login with your personal info
              </p> */}
              <h1>Central Controller</h1>
              <p>for Street Lights</p>
              <button
                className="ghost"
                id="signIn"
                onClick={() => handleOnClick("signIn")}
              >
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              {/* <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start explore content!</p> */}
              <h1>Central Controller</h1>
              <p>for Street Lights</p>
              <button
                className="ghost"
                id="signUp"
                onClick={() => handleOnClick("signUp")}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
