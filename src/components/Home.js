// components/Home.js
import React from "react";
import RecipeSearch from "./RecipeSearch";
import searchImage from "../video/search.jpg";
import RecipeSuggestions from "./RecipeSuggestions";
import NutritionForm from "./NutritionForm";

// Home component
const Home = () => {
  // Handler function for NutritionForm submissions
  const handleNutritionSubmit = (nutritionData) => {
    console.log("User Nutrition Preferences:", nutritionData);
    // Here, you can add logic to filter or fetch recipes based on the nutrition data
  };

  return (
    <div
      className="home_banner"
      style={{
        backgroundImage: `url(${searchImage})`,
        backgroundSize: "cover",
        color: "white",
        textAlign: "center",
        padding: "20px",
      }}
    >
  
      <RecipeSearch />      
        <NutritionForm onSubmit={handleNutritionSubmit} />
        <RecipeSuggestions />

      {/* Logout functionality can be added here if needed */}
    </div>
  );
};

export default Home;
