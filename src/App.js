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
import "./App.css"; // Optional: import for any custom CSS

function App() {
  return (
    <Router>
      <div className="App">
        <main>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<Home />} />
            <Route path="/recipe-search" element={<RecipeSearch />} />
            <Route path="/recipe-detail" element={<RecipeDetail />} />
            <Route path="/predicted-recipes" element={<PredictedRecipes />} />
            <Route path="/recipe-suggestions" element={<RecipeSuggestions />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
