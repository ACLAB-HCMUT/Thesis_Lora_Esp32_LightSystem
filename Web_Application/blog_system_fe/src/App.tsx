import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Account from "./component/Account/Account";
import Main from "./component/Main/Main";
import Profile from "./component/Profile/Profile";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { ToastContainer } from "react-toastify";
import PrivateRoute from "./component/PrivateRoute/PrivateRoute";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./component/Dashboard/Dashboard";
import { Statistical } from "./component/Statistical/Statistical";
const App = () => {
  const isSignIn = useSelector(
    (root: RootState) => root.user.signin.isSignedIn
  );
  return (
    <div className="App">
      <ToastContainer></ToastContainer>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main></Main>} />
          <Route
            path="/signin"
            element={isSignIn ? <Navigate to="/" /> : <Account />}
          />
          <Route
            path="/profile"
            element={<PrivateRoute element={<Profile />} />}
          />
          <Route
            path="/dashboard"
            element={<PrivateRoute element={<Dashboard />} />}
          />
          <Route
            path="/statistical"
            element={<PrivateRoute element={<Statistical />} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
