import React, { useEffect, useState } from "react";

const PredictedRecipes = () => {
  const [predictedRecipes, setPredictedRecipes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch predicted recipes from your backend
    const fetchPredictedRecipes = async () => {
      try {
        const response = await fetch("/api/predicted-recipes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            predicted_n_ingredients: 5, // Adjust based on your logic
          }),
        });

        // Check if the response is OK
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        setPredictedRecipes(data);
      } catch (error) {
        console.error("Error fetching predicted recipes:", error);
        setError(error.message);
      }
    };

    fetchPredictedRecipes();
  }, []);

  return (
    <div>
      <h1>Predicted Recipes</h1>
      {error ? (
        <p>Error: {error}</p>
      ) : predictedRecipes.length === 0 ? (
        <p>No predictions available.</p>
      ) : (
        <ul>
          {predictedRecipes.map((recipe) => (
            <li key={recipe.id}>
              <h2>{recipe.name}</h2>
              <p>{recipe.description}</p>
              {/* Add more recipe details as needed */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PredictedRecipes;
