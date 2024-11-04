import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const RecipeSuggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Slider settings for showing 3 recipes at once
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3, 
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div>
      <h1>Recipe Suggestions</h1>
      {suggestions.length === 0 ? (
        <p>No suggestions available at this time.</p>
      ) : (
        <Slider {...settings}>
          {suggestions.map((recipe, index) => (
            <div key={index} className="recipe-slide">
              <h3>{recipe.name}</h3>
              <p>
                <strong>Ingredients:</strong> {recipe.ingredients.join(", ")}
              </p>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default RecipeSuggestions;
