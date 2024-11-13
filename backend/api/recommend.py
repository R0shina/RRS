import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the dataset
csv_path = os.path.join(os.path.dirname(__file__), '../../dataset/recipes.csv')
print(f"Loading dataset from: {csv_path}")  # Debug: Check the file path
try:
    df = pd.read_csv(csv_path)
    print(f"Dataset loaded with {len(df)} rows.")  # Debug: Check dataset size
except Exception as e:
    print(f"Error loading dataset: {e}")
    df = pd.DataFrame()  # Empty dataframe in case of error

# Create TF-IDF vectorizer
tfidf_vectorizer = TfidfVectorizer()
tfidf_matrix = tfidf_vectorizer.fit_transform(df['ingredients'].astype(str))


@app.route('/api/recommend', methods=['POST'])
def recommend():
    try:
        # Log the incoming request for debugging
        print(f"Received request: {request.json}")

        # Extract ingredients and preferences from the request
        ingredients_query = request.json.get('ingredients', [])
        preferences = request.json.get('preferences', {})

        # Convert preference values to integers (default to 0 if not provided or invalid)
        calories = preferences.get('calories', '0')
        protein = preferences.get('protein', '0')
        fat = preferences.get('fat', '0')
        carbohydrates = preferences.get('carbohydrates', '0')

        # Convert the preference values from strings to integers
        try:
            calories = int(calories)
        except ValueError:
            calories = 0  # Fallback to 0 if not a valid integer

        try:
            protein = int(protein)
        except ValueError:
            protein = 0  # Fallback to 0 if not a valid integer

        try:
            fat = int(fat)
        except ValueError:
            fat = 0  # Fallback to 0 if not a valid integer

        try:
            carbohydrates = int(carbohydrates)
        except ValueError:
            carbohydrates = 0  # Fallback to 0 if not a valid integer

        # Validate that ingredients are provided
        if not ingredients_query:
            return jsonify({'error': 'No ingredients provided'}), 400
        
        # Log the ingredients and preferences
        print(f"Ingredients: {ingredients_query}")
        print(f"Preferences: Calories={calories}, Protein={protein}, Fat={fat}, Carbs={carbohydrates}")

        # Convert ingredients list to string
        ingredients_query_str = ' '.join(ingredients_query)

        # Vectorize the ingredients query and calculate cosine similarity
        query_vector = tfidf_vectorizer.transform([ingredients_query_str])
        cosine_similarities = cosine_similarity(query_vector, tfidf_matrix).flatten()

        # Get indices of the most similar recipes
        similar_indices = cosine_similarities.argsort()[-5:][::-1]
        recommended_recipes = df.iloc[similar_indices].to_dict(orient='records')

        # Log cosine similarity and selected recipes
        print(f"Cosine Similarities: {cosine_similarities}")
        print(f"Recommended recipes before filtering: {recommended_recipes}")

        # Relaxing the filtering to check if recommendations come through
        filtered_recipes = []

        # Filter recipes based on nutritional preferences if provided
        for recipe in recommended_recipes:
            # Log nutritional values of the recommended recipes before applying filter
            print(f"Checking recipe: {recipe.get('name')} with calories={recipe.get('calories')} protein={recipe.get('protein')} fat={recipe.get('fat')} carbs={recipe.get('carbs')}")

            if (
                (calories == 0 or recipe.get('calories', 0) <= calories + 50) and  # Allow +50 calorie difference
                (protein == 0 or recipe.get('protein', 0) >= protein - 5) and  # Allow -5g difference in protein
                (fat == 0 or recipe.get('fat', 0) <= fat + 5) and  # Allow +5g difference in fat
                (carbohydrates == 0 or recipe.get('carbs', 0) <= carbohydrates + 10)  # Allow +10g difference in carbs
            ):
                filtered_recipes.append(recipe)
            else:
                print(f"Recipe {recipe.get('name')} excluded due to preference filter")

        # Log the final recommendations
        print(f"Final recommended recipes: {filtered_recipes}")

        # Return the response in the expected format
        return jsonify({'recipes': filtered_recipes})

    except Exception as e:
        print(f"Error during recommendation: {e}")
        return jsonify({'error': f'An error occurred: {e}'}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Use port 5001 for this API
