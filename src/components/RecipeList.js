import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RecipeSearch from "./components/RecipeSearch";
import RecipeDetail from "./components/RecipeDetails";
import "./App.css"; // Optional: import for any custom CSS

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Welcome to Recipe Recommender</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<RecipeSearch />} />
            <Route path="/recipe-detail" element={<RecipeDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
