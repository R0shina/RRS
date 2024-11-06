import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth"; // Import the authentication check

const PrivateRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/" replace />;
};

export default PrivateRoute;
