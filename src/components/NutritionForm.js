import React, { useState } from "react";

function NutritionForm() {
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [fat, setFat] = useState("");
  const [carbohydrates, setCarbohydrates] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const ingredientsList = ingredients
      .split(",")
      .map((ingredient) => ingredient.trim())
      .filter(Boolean);

    if (!calories || !protein || !fat || !carbohydrates) {
      setError("Please fill in all nutritional fields.");
      return;
    }

    if (
      isNaN(calories) ||
      isNaN(protein) ||
      isNaN(fat) ||
      isNaN(carbohydrates)
    ) {
      setError("Please enter valid numeric values for all nutritional fields.");
      return;
    }

    console.log("Submitting values:", {
      calories,
      protein,
      fat,
      carbohydrates,
      ingredients: ingredientsList,
    });

    try {
      const response = await fetch("http://localhost:5001/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          preferences: { calories, protein, fat, carbohydrates },
          ingredients: ingredientsList,
        }),
      });

      const data = await response.json();
      console.log("Received data:", data);

      if (response.ok) {
        setRecipes(data.recipes || []);
        setError(null);
      } else {
        setError("An error occurred. Please try again.");
        setRecipes([]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError("An error occurred. Please try again.");
      setRecipes([]);
    }
  };

  return (
    <div>
      <h1>Recipe Recommendation</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Calories:</label>
          <input
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Protein:</label>
          <input
            type="number"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Fat:</label>
          <input
            type="number"
            value={fat}
            onChange={(e) => setFat(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Carbohydrates:</label>
          <input
            type="number"
            value={carbohydrates}
            onChange={(e) => setCarbohydrates(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Ingredients (comma-separated):</label>
          <input
            type="text"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
          />
        </div>
        <button type="submit">Get Recommendations</button>
      </form>

      {error && <div style={{ color: "red" }}>{error}</div>}

      <div>
        <h2>Recommended Recipes</h2>
        {recipes.length === 0 ? (
          <p>No recipes found based on your preferences.</p>
        ) : (
          <ul>
            {recipes.map((recipe) => (
              <li key={recipe.id}>
                <h3>{recipe.name}</h3>
                <p>{recipe.description || "No description available"}</p>
                <p>
                  Ingredients:{" "}
                  {Array.isArray(recipe.ingredients)
                    ? recipe.ingredients.join(", ")
                    : recipe.ingredients}
                </p>
                <p>Time to cook: {recipe.minutes || "N/A"} minutes</p>
                <button onClick={() => alert(`See full recipe: ${recipe.id}`)}>
                  See full recipe
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default NutritionForm;
