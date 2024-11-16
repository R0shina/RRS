import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RecipeSearch = () => {
  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 30; 
  const suggestionsPerPage = 100; 
  const navigate = useNavigate();

  // Fetch suggestions based on ingredients entered
  useEffect(() => {
    if (ingredients) {
      const fetchSuggestions = async () => {
        try {
          console.log("Fetching suggestions with ingredients:", ingredients);
          const response = await fetch(`http://localhost:5005/api/search`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ingredient: ingredients }),
          });
          const data = await response.json();
          console.log("Suggestions fetched:", data);

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
      .replace(/^,|,$/g, "") // Remove leading/trailing commas
      .split(",")
      .map((ingredient) => ingredient.trim())
      .filter((ingredient) => ingredient !== ""); // Remove empty ingredients
    console.log("Ingredients array for submission:", ingredientsArray);

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
      console.log("Fetched recipes:", data);

      // Check if the response contains a 'recipes' key and is an array
      if (data && Array.isArray(data.recipes)) {
        setRecipes(data.recipes);
      } else {
        console.error(
          "Expected an array of recipes under the 'recipes' key but received:",
          data
        );
        setRecipes([]);
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setRecipes([]);
    }
  };

  // Handle page change for suggestions pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    console.log("Changed to page:", pageNumber);
  };

  // Suggestions Pagination Logic
  const indexOfLastSuggestion = currentPage * suggestionsPerPage;
  const indexOfFirstSuggestion = indexOfLastSuggestion - suggestionsPerPage;
  const currentSuggestions = suggestions.slice(
    indexOfFirstSuggestion,
    indexOfLastSuggestion
  );

  // Navigate to recipe detail page
  const handleRecipeClick = (recipe) => {
    console.log("Recipe clicked:", recipe);
    navigate("/recipe-detail", { state: { recipe } });
  };

  const handleSuggestionClick = (suggestion) => {
    console.log("Suggestion clicked:", suggestion);
    navigate("/recipe-detail", { state: { recipe: suggestion } });
    setIsDropdownOpen(false);
  };

  const handleLogoutClick = () => {
    console.log("Logging out...");
    navigate("/logout");
  };

  console.log("Current Suggestions for Page:", currentSuggestions);

  // Update ingredients state as user types
  const handleSearchInputChange = (event) => {
    setIngredients(event.target.value);
  };

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
                onChange={handleSearchInputChange} // Update ingredients as user types
                placeholder="Search recipes by ingredients..."
              />
            </div>
            <button type="submit">Get Recipes</button>
          </form>
        </div>

        {isDropdownOpen && (
          <div className="suggestions-list">
            <div className="suggestions-dropdown">
              {currentSuggestions.length > 0 ? (
                <ul>
                  {currentSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion.ingredients.join(", ")}
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

      {recipes.length > 0 && (
        <div className="recommendation">
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

      {/* Pagination for Suggestions */}
      {/* {isDropdownOpen && currentSuggestions.length > 0 && ( */}
        <div className="pagination">
          <div className="paginationbutton">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1} 
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={indexOfLastSuggestion >= suggestions.length} 
            >
              Next
            </button>
          </div>
        </div>
      {/* )} */}
    </div>
  );
};

export default RecipeSearch;
