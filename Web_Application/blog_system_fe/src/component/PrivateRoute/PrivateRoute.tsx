import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
export const isAuthenticated = (): boolean => {
  // return localStorage.getItem("isLoggedIn") === "true";
  const isSignIn = useSelector(
    (state: RootState) => state.user.signin.isSignedIn
  );
  return isSignIn;
};

interface PrivateRouteProps {
  element: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/" />;
};

export default PrivateRoute;
