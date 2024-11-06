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
          <div className="nutrition">
            <strong>Nutrition:</strong> {JSON.stringify(recipe.nutrition)}
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
          {/* <p>
            <strong>Tags:</strong>{" "}
            {Array.isArray(recipe.tags)
              ? recipe.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))
              : "No tags available"}
          </p> */}
        </div>
      </div>

      {/* Add RecipeSuggestions section */}
      <RecipeSuggestions />
    </div>
  );
};

export default RecipeDetail;
