import React from "react";
import { useLocation } from "react-router-dom";
import RecipeSuggestions from "./RecipeSuggestions"; // Import the suggestions component
import "../../src/App.css"; // Import the CSS file
import searchImage from "../video/step.jpg";

const RecipeDetail = () => {
  const location = useLocation();
  const { recipe } = location.state || {};

  // Check if the recipe exists
  if (!recipe) {
    return <div>No recipe details available.</div>;
  }

  // Check if nutrition data is available
  const nutrition = recipe.nutrition || [];
  const [calories, protein, fat, carbohydrates, fiber, sugar, other] =
    nutrition;

  // Log the nutrition data to the console
  console.log("Nutrition Data:", nutrition);

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

          {/* Display nutrition information if available */}
          {nutrition.length > 0 && (
            <div className="nutrition">
              <strong>Nutrition:</strong>
              <ul>
                {calories && <li>Calories: {calories}</li>}
                {protein && <li>Protein: {protein}g</li>}
                {fat && <li>Fat: {fat}g</li>}
                {carbohydrates && <li>Carbohydrates: {carbohydrates}g</li>}
                {fiber && <li>Fiber: {fiber}g</li>}
                {sugar && <li>Sugar: {sugar}g</li>}
                {other && <li>Other: {other}</li>}
              </ul>
            </div>
          )}

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
        </div>
      </div>

      {/* Add RecipeSuggestions section */}
      <RecipeSuggestions />
    </div>
  );
};

export default RecipeDetail;
