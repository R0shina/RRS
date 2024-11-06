import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Home from "./components/Home";
import RecipeSearch from "./components/RecipeSearch";
import RecipeDetail from "./components/RecipeDetails";
import PredictedRecipes from "./components/PredictedRecipes";
import RecipeSuggestions from "./components/RecipeSuggestions";
import PrivateRoute from "./components/PrivateRoute";  // Import PrivateRoute
import "./App.css"; // Optional: import for any custom CSS


function App() {
  return (
    <Router>
      <div className="App">
        <main>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/home"
              element={<PrivateRoute element={<Home />} />}  // Protect Home route
            />
            <Route
              path="/recipe-search"
              element={<PrivateRoute element={<RecipeSearch />} />}  // Protect Recipe Search route
            />
            <Route
              path="/recipe-detail"
              element={<PrivateRoute element={<RecipeDetail />} />}  // Protect Recipe Detail route
            />
            <Route
              path="/predicted-recipes"
              element={<PrivateRoute element={<PredictedRecipes />} />}  // Protect Predicted Recipes route
            />
            <Route
              path="/recipe-suggestions"
              element={<PrivateRoute element={<RecipeSuggestions />} />}  // Protect Recipe Suggestions route
            />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
