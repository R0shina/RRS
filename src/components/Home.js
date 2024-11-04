// src/components/Home.js

import React from "react";
import RecipeSearch from "./RecipeSearch"; // Import RecipeSearch

const Home = () => {
  return (
    <div>
      <h1>Welcome to the Recipe Recommendation System</h1>
      <RecipeSearch />
    </div>
  );
};

export default Home;
