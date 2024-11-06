// components/Home.js
import React from "react";
import RecipeSearch from "./RecipeSearch";
import searchImage from "../video/search.jpg";
import RecipeSuggestions from "./RecipeSuggestions";

const Home = () => {
  return (
    <div
      className="home_banner"
      style={{
        backgroundImage: `url(${searchImage})`,
        backgroundSize: "cover",
        color: "white",
        textAlign: "center",
      }}
    >
      <RecipeSearch />
      <RecipeSuggestions />
    </div>
  );
};

export default Home;
