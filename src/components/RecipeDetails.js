import React from "react";
import { useLocation } from "react-router-dom";
import "../../src/App.css"; // Import the CSS file
import searchImage from "../video/step.jpg"; // Import useNavigate

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
          {" "}
          {/* Apply the CSS class here */}
          <h2>{recipe.name}</h2>
          {/* <p>
          <strong>ID:</strong> {recipe.id}
        </p> */}
          <p>
            <strong>Preparation Time:</strong> {recipe.minutes} minutes
          </p>
          {/* <p>
          <strong>Contributor ID:</strong> {recipe.contributor_id}
        </p> */}
          {/* <p>
          <strong>Submitted:</strong> {recipe.submitted}
        </p> */}
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
          <p>
            <strong>Tags:</strong>{" "}
            {Array.isArray(recipe.tags)
              ? recipe.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))
              : recipe.tags || "No tags available"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
