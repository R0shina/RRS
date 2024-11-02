import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import videoFile from "../video/video.mp4"; // Import the video file

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5002/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        alert("Signup successful! Redirecting to login...");
        navigate("/"); // Redirect to login page
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setError("Failed to fetch");
    }
  };

  return (
    <div className="signup-container">
      <div>
        <video autoPlay loop muted className="video-background">
          <source src={videoFile} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="overlay"></div>
        <div className="form-container">
          <h2>Sign Up</h2>
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
            {error && <p className="error-message">{error}</p>}
            <button type="submit">Signup</button>
          </form>
          <p>
            Already have an account?{" "}
            <a href="/" onClick={() => navigate("/")}>
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
