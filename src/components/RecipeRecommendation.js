import React, { useState, useEffect } from "react";
import axios from "axios";

function RecipeRecommendation() {
  const [recommendations, setRecommendations] = useState([]);
  const [userId, setUserId] = useState(1); // Example user ID

  useEffect(() => {
    const fetchRecommendations = async (ingredients) => {
      try {
        const response = await fetch("http://127.0.0.1:5001/api/recommend", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userId }), // Make sure you're sending a user_id
        });

        const data = await response.json();
        console.log("Recommended Recipes:", data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchRecommendations();
  }, [userId]);

  return (
    <div>
      <h1>Recommended Recipes</h1>
      <ul>
        {recommendations.map((recipe, index) => (
          <li key={index}>{recipe}</li>
        ))}
      </ul>
    </div>
  );
}

export default RecipeRecommendation;
