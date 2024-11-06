// RecipeSuggestions.js
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";

const RecipeSuggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5005/api/suggestions");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Error ${response.status}: ${errorData.message}`);
        }
        const data = await response.json();
        setSuggestions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  if (loading) {
    return <p>Loading suggestions...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: false,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <div>
      <h1>Recipe Suggestions</h1>
      {suggestions.length === 0 ? (
        <p>No suggestions available at this time.</p>
      ) : (
        <Slider {...settings}>
          {suggestions.map((recipe, index) => (
            <div className="recipe-slide">
              <div className="recipie-inside" key={index}>
                <h3>{recipe.name}</h3>
                <p>
                  <strong>Ingredients:</strong> {recipe.ingredients.join(", ")}
                </p>
                <button
                  onClick={() =>
                    navigate(`/recipe-detail`, { state: { recipe } })
                  }
                  className="view-recipe-button"
                >
                  View Full Recipe
                </button>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default RecipeSuggestions;
