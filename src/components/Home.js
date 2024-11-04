import React from "react";
import RecipeSearch from "./RecipeSearch";
import searchImage from "../video/search.jpg";
import RecipeSuggestions from "./RecipeSuggestions";

const Home = () => {
  return (
    <div
      className="search"
      style={{
        backgroundImage: `url(${searchImage})`,
        backgroundSize: "cover",
        color: "white",
        textAlign: "center",
      }}
    >
      <h1>Welcome to the Recipe Recommendation System</h1>
      <RecipeSearch />
      <RecipeSuggestions />
    </div>
  );
};

export default Home;
