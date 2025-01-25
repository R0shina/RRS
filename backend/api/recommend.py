import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the dataset
csv_path = os.path.join(os.path.dirname(__file__), '../../dataset/recipes.csv')
print(f"Loading dataset from: {csv_path}")  # Debug: Check the file path

try:
    df = pd.read_csv(csv_path)
    print(f"Dataset loaded with {len(df)} rows.")  # Debug: Check dataset size
    print(f"Dataset columns: {df.columns}")  # Debug: Check column names

    # Parse the 'nutrition' column if it contains JSON-like data
    def parse_nutrition(nutrition):
        try:
            # Check if the nutrition data is a JSON object or a list
            if isinstance(nutrition, str):
                nutrition_data = json.loads(nutrition)
                if isinstance(nutrition_data, dict):  # If it's a dictionary, extract values
                    return {
                        'calories': nutrition_data.get('calories', 0),
                        'protein': nutrition_data.get('protein', 0),
                        'fat': nutrition_data.get('fat', 0),
                        'carbs': nutrition_data.get('carbohydrates', 0),
                    }
                elif isinstance(nutrition_data, list):  # If it's a list, handle it accordingly
                    return {
                        'calories': nutrition_data[0] if len(nutrition_data) > 0 else 0,
                        'protein': nutrition_data[1] if len(nutrition_data) > 1 else 0,
                        'fat': nutrition_data[2] if len(nutrition_data) > 2 else 0,
                        'carbs': nutrition_data[3] if len(nutrition_data) > 3 else 0,
                    }
            else:
                return {'calories': 0, 'protein': 0, 'fat': 0, 'carbs': 0}
        except (json.JSONDecodeError, TypeError, IndexError):
            return {'calories': 0, 'protein': 0, 'fat': 0, 'carbs': 0}

    # Apply the parsing function to the 'nutrition' column
    nutrition_info = df['nutrition'].apply(parse_nutrition)
    nutrition_df = pd.json_normalize(nutrition_info)
    df = pd.concat([df, nutrition_df], axis=1)  # Add nutritional values as columns

except Exception as e:
    print(f"Error loading dataset: {e}")
    df = pd.DataFrame()  # Empty dataframe in case of error

# Ensure the ingredients column exists
if 'ingredients' in df.columns:
    # Create TF-IDF vectorizer
    tfidf_vectorizer = TfidfVectorizer()
    tfidf_matrix = tfidf_vectorizer.fit_transform(df['ingredients'].astype(str))
else:
    print("Ingredients column not found in the dataset.")
    # Exit the application if ingredients column is missing
    exit()


@app.route('/api/recommend', methods=['POST'])
def recommend():
    try:
        # Extract ingredients and preferences from the request
        ingredients_query = request.json.get('ingredients', [])
        preferences = request.json.get('preferences', {})

        # Log incoming data for debugging
        print("Received ingredients:", ingredients_query)
        print("Received preferences:", preferences)

        # Validate that ingredients are provided
        if not ingredients_query:
            return jsonify({'error': 'No ingredients provided'}), 400

        # Convert ingredients list to string
        ingredients_query_str = ' '.join(ingredients_query)

        # Vectorize the ingredients query and calculate cosine similarity
        query_vector = tfidf_vectorizer.transform([ingredients_query_str])
        cosine_similarities = cosine_similarity(query_vector, tfidf_matrix).flatten()

        # Set a desired number of suggestions, e.g., 100 (or whatever number you want)
        num_suggestions = 100  # Change this to the number of suggestions you want
        
        # Ensure we do not request more suggestions than available recipes
        num_recipes_available = len(df)
        num_suggestions = min(num_suggestions, num_recipes_available)  # Cap the suggestions to available recipes

        # Get indices of the most similar recipes (up to the desired number)
        similar_indices = cosine_similarities.argsort()[-num_suggestions:][::-1]
        recommended_recipes = df.iloc[similar_indices].to_dict(orient='records')

        # Filter recipes based on nutritional preferences if provided
        filtered_recipes = []

        # Relax the filtering logic with tolerance on nutritional values
        for recipe in recommended_recipes:
            # Get nutritional values of the recipe (set default to 0 if missing)
            recipe_calories = recipe.get('calories', 0)
            recipe_protein = recipe.get('protein', 0)
            recipe_fat = recipe.get('fat', 0)
            recipe_carbs = recipe.get('carbs', 0)

            # Log nutritional values before applying filter (for debugging)
            print(f"Checking recipe: {recipe.get('name')} with calories={recipe_calories}, protein={recipe_protein}, fat={recipe_fat}, carbs={recipe_carbs}")

            # Apply relaxed filtering with a tolerance (+/-) for nutritional preferences
            if (
                (preferences.get('calories', 0) == 0 or recipe_calories <= preferences['calories'] + 50) and  # Allow +50 calorie difference
                (preferences.get('protein', 0) == 0 or recipe_protein >= preferences['protein'] - 5) and  # Allow -5g difference in protein
                (preferences.get('fat', 0) == 0 or recipe_fat <= preferences['fat'] + 5) and  # Allow +5g difference in fat
                (preferences.get('carbohydrates', 0) == 0 or recipe_carbs <= preferences['carbohydrates'] + 10)  # Allow +10g difference in carbs
            ):
                filtered_recipes.append(recipe)

        # Return the response in the expected format
        return jsonify({'recipes': filtered_recipes})

    except Exception as e:
        # Handle unexpected errors and return a meaningful message
        print(f"Error during recommendation: {e}")
        return jsonify({'error': f'An error occurred: {e}'}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Use port 5001 for this API
