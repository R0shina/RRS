import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import searchImage from "../video/search.jpg"; // Import useNavigate

const RecipeSearch = () => {
  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (event) => {
    event.preventDefault();

    const ingredientsArray = ingredients
      .split(",")
      .map((ingredient) => ingredient.trim());

    try {
      const response = await fetch("http://localhost:5001/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients: ingredientsArray }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  const handleRecipeClick = (recipe) => {
    // Navigate to RecipeDetail and pass the recipe as state
    navigate("/recipe-detail", { state: { recipe } });
  };

  const handleLogoutClick = () => {
    // Navigate to the Logout page
    navigate("/logout");
  };

  return (
    <div
      className="search"
      style={{
        backgroundImage: `url(${searchImage})`,
      }}
    >
      <header className="heading">
        <h1>Cook Smarter: Find Your Perfect Recipe!</h1>
        <div className="logout-button">
          <button onClick={handleLogoutClick} style={{ float: "right" }}>
            Logout
          </button>
        </div>
      </header>
      <div className="searchpage">
        <Link to="/predicted-recipes">See Predicted Recipes</Link>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Enter ingredients (comma separated): </label>
            <input
              type="text"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
            />
          </div>
          <button type="submit">Get Recipes</button>
        </form>
      </div>
      {recipes.length > 0 && (
        <div className="recomendation">
          <div className="searchdata">
            <h2>Recommended Recipes</h2>
            <ul>
              {recipes.map((recipe, index) => (
                <li key={index}>
                  <h3>{recipe.name}</h3>
                  <p>
                    <strong>Ingredients:</strong>{" "}
                    {Array.isArray(recipe.ingredients)
                      ? recipe.ingredients.join(", ")
                      : recipe.ingredients}
                  </p>
                  <button onClick={() => handleRecipeClick(recipe)}>
                    See Full Recipe
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeSearch;
