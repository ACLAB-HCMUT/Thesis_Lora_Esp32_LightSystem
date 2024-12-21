import { useState } from "react";
import { configAxios } from "../../config/axios";
import { useNavigate } from "react-router-dom";
import { SignIn_Interface } from "./Signin_Interface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { saveToken } from "../../redux/slice/user/signinSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import ModalActivate from "./Modal_Activate";

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [state, setState] = useState<SignIn_Interface>({
    email: "",
    password: "",
  });
  const [isOpen, setOpen] = useState<boolean>(false);
  const handleClickOpenModal = () => {
    setOpen(true);
  };
  const handleCloseModal = () => {
    setOpen(false);
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setState({
      ...state,
      [event.target.name]: value,
    });
  };

  const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const response = await configAxios.post("auth/signin", state);
      if (response && response.data && response.data.access_token) {
        console.log(response, "check point");
        dispatch(saveToken(response.data.access_token));
        navigate("/");
      }
    } catch (error: any) {
      toast.error(`${error.response?.data?.message || "An error occurred"}`);
    }
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Sign in</h1>
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
        <span>or use your account</span>
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={state.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={state.password}
          onChange={handleChange}
        />
        <a href="#">Forgot your password?</a>
        <a href="#" className="btn-activate" onClick={handleClickOpenModal}>
          Activate your account
        </a>
        {isOpen && <ModalActivate isOpen={isOpen} onClose={handleCloseModal} />}
        <button>Sign In</button>
      </form>
    </div>
  );
};

export default SignIn;
