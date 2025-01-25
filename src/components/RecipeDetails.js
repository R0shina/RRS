import React from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import RecipeSuggestions from "./RecipeSuggestions"; // Import the suggestions component
import "../../src/App.css"; // Import the CSS file
import searchImage from "../video/step.jpg";

const RecipeDetail = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize navigate function
  const { recipe } = location.state || {};

  // Check if the recipe exists
  if (!recipe) {
    return <div>No recipe details available.</div>;
  }

  // Convert nutrition string to array if it's not already
  const nutritionString = recipe.nutrition || "[]"; // Handle cases where nutrition might be undefined
  const nutrition = JSON.parse(nutritionString); // Convert nutrition string to array

  // Default values for nutrition data in case any field is missing
  const [
    calories = "N/A",
    protein = "N/A",
    fat = "N/A",
    carbohydrates = "N/A",
    fiber = "N/A",
    sugar = "N/A",
    other = "N/A",
  ] = nutrition;

  // Function to handle the back button click
  const goBackHome = () => {
    navigate("/"); // Navigate to the home page
  };

  return (
    <div
      className="details"
      style={{
        backgroundImage: `url(${searchImage})`,
      }}
    >
      <div className="recipie-div">
        <div className="recipe-detail">
          <h2>{recipe.name}</h2>
          <p>
            <strong>Preparation Time:</strong> {recipe.minutes} minutes
          </p>

          {/* Redesigned Nutrition Section */}
          <div className="nutrition">
            <h3>Nutrition Information</h3>
            <div className="nutrition-grid">
              <div className="nutrition-item">
                <span className="nutrition-label">Calories</span>
                <span className="nutrition-value">{calories} kcal</span>
              </div>
              <div className="nutrition-item">
                <span className="nutrition-label">Protein</span>
                <span className="nutrition-value">{protein} g</span>
              </div>
              <div className="nutrition-item">
                <span className="nutrition-label">Fat</span>
                <span className="nutrition-value">{fat} g</span>
              </div>
              <div className="nutrition-item">
                <span className="nutrition-label">Carbs</span>
                <span className="nutrition-value">{carbohydrates} g</span>
              </div>
              <div className="nutrition-item">
                <span className="nutrition-label">Fiber</span>
                <span className="nutrition-value">{fiber} g</span>
              </div>
              <div className="nutrition-item">
                <span className="nutrition-label">Sugar</span>
                <span className="nutrition-value">{sugar} g</span>
              </div>
              <div className="nutrition-item">
                <span className="nutrition-label">Other</span>
                <span className="nutrition-value">{other}</span>
              </div>
            </div>
          </div>

          <p>
            <strong>Number of Steps:</strong> {recipe.n_steps}
          </p>
          <p>
            <strong>Steps:</strong>{" "}
            {Array.isArray(recipe.steps)
              ? recipe.steps.join(", ")
              : recipe.steps}
          </p>
          <p>
            <strong>Description:</strong> {recipe.description}
          </p>
          <p>
            <strong>Ingredients:</strong>{" "}
            {Array.isArray(recipe.ingredients)
              ? recipe.ingredients.join(", ")
              : recipe.ingredients}
          </p>
          <p>
            <strong>Number of Ingredients:</strong> {recipe.n_ingredients}
          </p>

          {/* Add a button to go back to the home page */}
          <button onClick={goBackHome} className="go-back-btn">
            Go Back to Home
          </button>
        </div>
      </div>

      {/* Add RecipeSuggestions section */}
      <RecipeSuggestions />
    </div>
  );
};

export default RecipeDetail;
