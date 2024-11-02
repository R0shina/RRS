// src/components/Home.js

import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Welcome to the Recipe Recommendation System</h1>
      <Link to="/predicted-recipes">See Predicted Recipes</Link>
      {/* Other content */}
    </div>
  );
};
