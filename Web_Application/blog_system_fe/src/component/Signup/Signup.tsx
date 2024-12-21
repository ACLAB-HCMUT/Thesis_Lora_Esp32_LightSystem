import React, { useState, ChangeEvent, FormEvent } from "react";
import { SignUpState } from "./Signup_Interface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { configAxios } from "../../config/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const SignUp: React.FC = () => {
  const [state, setState] = useState<SignUpState>({
    lastName: "",
    firstName: "",
    email: "",
    password: "",
  });

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleOnSubmit = async (evt: FormEvent) => {
    evt.preventDefault();
    try {
      const response = await configAxios.post("auth/signup", state);
      if (response) {
        toast.success(`${response.data.message}`);
        setState({ lastName: "", firstName: "", email: "", password: "" });
      }
    } catch (error) {
      console.error(error);
      toast.error("Sign up failed. Please try again.");
    }
  };

  return (
    <div className="form-container sign-up-container">
      <form>
        <h1>Create Account</h1>
        <div className="social-container">
          <a href="#" className="social">
            <FontAwesomeIcon icon={faFacebook} />
          </a>
          <a href="#" className="social">
            <FontAwesomeIcon icon={faGoogle} />
          </a>
          <a href="#" className="social">
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
        </div>
        <span>or use your email for registration</span>
        <input
          type="text"
          name="firstName"
          value={state.firstName}
          onChange={handleChange}
          placeholder="First Name"
        />
        <input
          type="text"
          name="lastName"
          value={state.lastName}
          onChange={handleChange}
          placeholder="Last Name"
        />
        <input
          type="email"
          name="email"
          value={state.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={state.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <button type="submit" onClick={handleOnSubmit}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
