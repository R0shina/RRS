import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import videoFile from "../video/video.mp4"; // Import the video file
import { isAuthenticated } from "../utils/auth"; // Import the authentication check

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Redirect if the user is already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/home"); // Redirect to /home if already authenticated
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5002/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // On successful login, store a flag in localStorage
        localStorage.setItem("isLoggedIn", "true");
        alert("Login successful! Redirecting...");
        navigate("/home"); // Redirect to home page
      } else {
        const data = await response.json();
        setError(data.message); // Display error if login fails
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Failed to fetch");
    }
  };

  return (
    <div className="login-container">
      <div>
        <video autoPlay loop muted className="video-background">
          <source src={videoFile} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="overlay"></div>
        <div className="form-container">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button type="submit">Login</button>
          </form>

          <p>
            Don't have an account? <a href="/signup">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
