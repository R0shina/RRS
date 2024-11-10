import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Fuse from "fuse.js";

const RecipeSearch = () => {
  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 10; // Number of recipes per page
  const navigate = useNavigate();

  // Fetch suggestions based on ingredients entered
  useEffect(() => {
    if (ingredients) {
      const fetchSuggestions = async () => {
        try {
          console.log("Fetching suggestions with ingredients:", ingredients); // Log the ingredients being used to fetch suggestions
          const response = await fetch(`http://localhost:5005/api/search`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ingredient: ingredients }),
          });
          const data = await response.json();
          console.log("Suggestions fetched:", data); // Log the suggestions data

          if (Array.isArray(data)) {
            setSuggestions(data);
          } else {
            console.error("Expected an array but received:", data);
            setSuggestions([]);
          }
          setIsDropdownOpen(true);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
          setIsDropdownOpen(false);
        }
      };
      fetchSuggestions();
    } else {
      setSuggestions([]);
      setIsDropdownOpen(false);
    }
  }, [ingredients]);

  // Handle form submission to get recipes based on selected ingredients
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
      console.log("Fetched recipes:", data); // Log the fetched recipe data

      // Check if the response is an object with a message
      if (data && data.message === "No matching recipes found") {
        setRecipes([]);
        console.log("No matching recipes found.");
      } else if (Array.isArray(data)) {
        setRecipes(data);
      } else {
        console.error("Expected an array of recipes but received:", data);
        setRecipes([]);
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setRecipes([]);
    }
  };

  // Handle page change for pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Fuse.js setup for fuzzy matching
  const fuse = new Fuse(suggestions, {
    keys: ["ingredients"], // Search within the ingredients
    threshold: 0.3, // Adjust this value for fuzziness (lower means stricter, higher means looser match)
  });

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setIngredients(query);
    console.log("User input changed:", query); // Log user input

    // If the input is empty, reset suggestions
    if (query) {
      const results = fuse.search(query).map((result) => result.item);
      console.log("Fuse.js search results:", results); // Log Fuse.js search results
      setSuggestions(results);
      setIsDropdownOpen(true);
    } else {
      setSuggestions([]);
      setIsDropdownOpen(false);
    }
  };

  // Navigate to recipe detail page with ingredient or recipe details
  const handleRecipeClick = (recipe) => {
    navigate("/recipe-detail", { state: { recipe } });
  };

  // Navigate to recipe detail page with suggestion ingredient
  const handleSuggestionClick = (suggestion) => {
    // Ensure suggestion contains all the needed recipe data
    console.log("Suggestion clicked:", suggestion); // Log the suggestion clicked
    navigate("/recipe-detail", { state: { recipe: suggestion } });
    setIsDropdownOpen(false);
  };

  // Slice the recipes to show only 10 per page
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

  const handleLogoutClick = () => {
    navigate("/logout");
  };

  console.log("Current Recipes for Page:", currentRecipes); // Log the current recipes being displayed

  return (
    <div>
      <header className="heading">
        <h1>Welcome to the Recipe Recommendation System</h1>
        <h2>Cook Smarter: Find Your Perfect Recipe!</h2>

        <div className="logout-button">
          <button onClick={handleLogoutClick} style={{ float: "right" }}>
            Logout
          </button>
        </div>
      </header>
      <div className="searchpage">
        <div className="searchcontainer">
          <form onSubmit={handleSubmit}>
            <div>
              <label>Enter ingredients (comma separated): </label>
              <input
                type="text"
                value={ingredients}
                onChange={handleSearchInputChange} // Use the modified input handler
                placeholder="Search recipes by ingredients..."
              />
            </div>
            <button type="submit">Get Recipes</button>
          </form>
        </div>

        {/* Suggestions dropdown */}
        {isDropdownOpen && (
          <div className="suggestions-list">
            <div className="suggestions-dropdown">
              {suggestions.length > 0 ? (
                <ul>
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)} // Navigate on suggestion click
                    >
                      {suggestion.ingredients.join(", ")}{" "}
                      {/* Join ingredients with commas */}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No suggestions available</p>
              )}
            </div>
          </div>
        )}
      </div>

      {currentRecipes.length > 0 && (
        <div className="recomendation">
          <div className="searchdata">
            <h2>Recommended Recipes</h2>
            <ul>
              {currentRecipes.map((recipe, index) => (
                <li key={index}>
                  <h3>{recipe.name}</h3>
                  <p>
                    <strong>Ingredients:</strong>{" "}
                    {Array.isArray(recipe.ingredients)
                      ? recipe.ingredients.join(", ") // Join ingredients with commas
                      : recipe.ingredients}
                  </p>
                  <button onClick={() => handleRecipeClick(recipe)}>
                    See Full Recipe
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {/* Pagination */}
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage * recipesPerPage >= recipes.length}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeSearch;
