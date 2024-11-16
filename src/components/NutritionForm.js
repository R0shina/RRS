import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function NutritionForm() {
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [fat, setFat] = useState("");
  const [carbohydrates, setCarbohydrates] = useState("");
  const [ingredients, setIngredients] = useState(""); // New state for ingredients
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Hook to navigate to different pages

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Convert comma-separated string into an array of ingredients
    const ingredientsList = ingredients
      .split(",")
      .map((ingredient) => ingredient.trim());

    // Convert protein to a number if it's not empty
    const proteinValue = protein ? Number(protein) : null;
    const caloriesValue = calories ? Number(calories) : null;
    const fatValue = fat ? Number(fat) : null;
    const carbsValue = carbohydrates ? Number(carbohydrates) : null;

    // Log the form data before sending the request
    console.log("Submitting nutritional values and ingredients:", {
      calories: caloriesValue,
      protein: proteinValue,
      fat: fatValue,
      carbohydrates: carbsValue,
      ingredients: ingredientsList,
    });

    try {
      // Call your backend API with the nutritional values and ingredients
      const response = await fetch("http://localhost:5001/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          preferences: {
            calories: caloriesValue,
            protein: proteinValue,
            fat: fatValue,
            carbohydrates: carbsValue,
          },
          ingredients: ingredientsList,
        }),
      });

      // Log the response status and the response body
      console.log("API response status:", response.status);
      const data = await response.json();

      // Log the data received from the backend
      console.log("API response data:", data);

      // Update the state with recipe suggestions
      if (response.ok) {
        setRecipes(data.recipes); // Assuming your API returns a 'recipes' field
        setError(null);
      } else {
        setError("An error occurred. Please try again.");
        setRecipes([]); // Clear recipes if there's an error
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError("An error occurred. Please try again.");
      setRecipes([]); // Clear recipes if there's an error
    }
  };

  const handleRecipeClick = (suggestion) => {
    // Navigate to the recipe detail page using the recipe ID
    navigate("/recipe-detail", { state: { recipe: suggestion } });
  };

  return (
    <div>
      <h2>Enter Desired Nutritional Values</h2>
      <div className="formclass">
        <form className="formdata" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="calories">Calories:</label>
            <input
              type="number"
              id="calories"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="protein">Protein (g):</label>
            <input
              type="text"
              id="protein"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="fat">Fat (g):</label>
            <input
              type="number"
              id="fat"
              value={fat}
              onChange={(e) => setFat(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="carbohydrates">Carbohydrates (g):</label>
            <input
              type="number"
              id="carbohydrates"
              value={carbohydrates}
              onChange={(e) => setCarbohydrates(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="ingredients">Ingredients (comma-separated):</label>
            <input
              type="text"
              id="ingredients"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="e.g., chicken, rice, beans"
            />
          </div>

          <button type="submit">Get Recipe Recommendations</button>
        </form>
      </div>

      {/* Display error message if there's an error */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Display recipe suggestions if any */}
      <h1>Recipe Suggestions</h1>
      <div className="recipeul">
        <ul>
          {recipes.length > 0 ? (
            recipes.map((recipe) => (
              <li
                className="recipelist"
                key={recipe.id}
                onClick={() => handleRecipeClick(recipe)} // Pass entire recipe object
                style={{ cursor: "pointer" }}
              >
                <strong>{recipe.name}</strong>
              </li>
            ))
          ) : (
            <p>No recipes found. Try different nutritional values.</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default NutritionForm;
