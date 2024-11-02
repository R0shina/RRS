import React, { useState } from "react";

const RecipeSearch = () => {
  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState([]);

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

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Enter ingredients (comma separated):
          <input
            type="text"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
        </label>
        <button type="submit">Get Recipes</button>
      </form>

      {recipes.length > 0 && (
        <div>
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
                <p>
                  <strong>Steps:</strong>{" "}
                  {Array.isArray(recipe.steps)
                    ? recipe.steps.join(", ")
                    : recipe.steps}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RecipeSearch;

// Bhako
