import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth"; // Import the logout utility function

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Ask the user for confirmation before logging out
    const confirmLogout = window.confirm("Are you sure you want to log out?");

    if (confirmLogout) {
      // Call the logout function to clear the login state
      logout(); // This will remove the authentication flag from localStorage
      alert("You have logged out successfully.");
      navigate("/"); // Redirect to the login page
    } else {
      // User clicked 'Cancel', do nothing
      console.log("Logout canceled");
    }
  };

  return (
    <div className="logout-container">
      <div>
        <h2>Logout</h2>
        <p>Are you sure you want to log out?</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Logout;
