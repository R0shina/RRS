import os
import ast
import pandas as pd
from flask import Flask, jsonify, request
import joblib
import random
from flask_cors import CORS


# Enable CORS for the entire app

# Initialize the Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}) 

# Paths for CSV and model files
csv_path = os.path.join(os.path.dirname(__file__), '../../dataset/recipes.csv')
model_path = os.path.join(os.path.dirname(__file__), 'recipe_model.pkl')

# Load the dataset and clean the data
if os.path.exists(csv_path):
    data = pd.read_csv(csv_path, quotechar='"', skipinitialspace=True)

    # Clean up specific columns
    columns_to_clean = ['contributor_id', 'description', 'id', 'ingredients',
                        'minutes', 'n_ingredients', 'n_steps', 'name',
                        'nutrition', 'steps', 'submitted', 'tags']
    for column in columns_to_clean:
        if column in data.columns:
            data[column] = data[column].apply(lambda x: x.strip().strip("'") if isinstance(x, str) else x)

    # Convert stringified lists to actual lists
    list_columns = ['ingredients', 'steps', 'tags']
    for col in list_columns:
        data[col] = data[col].apply(lambda x: ast.literal_eval(x) if isinstance(x, str) and x.startswith('[') else x)

    # Replace NaN values with empty strings
    data.fillna(value="", inplace=True)

    # Convert DataFrame to JSON for easier access
    json_data = data.to_dict(orient='records')

    @app.route('/api/recipes', methods=['GET'])
    def get_recipes():
        return jsonify(json_data)

else:
    print(f"File not found: {csv_path}")

# Load the trained model
try:
    model = joblib.load(model_path)
    print("Model loaded successfully!")
except FileNotFoundError:
    print(f"Model not found: {model_path}")
    model = None

# Memory to store recent searches
recent_searches = []


@app.route('/api/save-search', methods=['POST'])
def save_search():
    data = request.json
    if 'search_term' not in data:
        return jsonify({"error": "Missing search term"}), 400

    search_term = data['search_term']
    if search_term not in recent_searches:
        recent_searches.append(search_term)

    # Optional: Limit the number of stored searches (keep last 10)
    if len(recent_searches) > 10:
        recent_searches.pop(0)

    return jsonify({"message": "Search term saved"}), 200


@app.route('/api/recent-searches', methods=['GET'])
def get_recent_searches():
    return jsonify(recent_searches)


@app.route('/api/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    # Ensure required fields are present
    data = request.json
    required_fields = ['minutes', 'n_steps', 'name']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing data for prediction"}), 400

    # Prepare input data for prediction
    input_data = pd.DataFrame({
        'minutes': [data['minutes']],
        'n_steps': [data['n_steps']],
        'name': [data['name']]
    })

    # Predict the number of ingredients using the model
    prediction = model.predict(input_data)

    return jsonify({"predicted_n_ingredients": prediction[0]})


@app.route('/api/predict-recipes', methods=['POST'])
def predict_recipes():
    data = request.get_json()
    preferences = data.get('preferences', {})
    ingredients = data.get('ingredients', [])

    # Extracting nutritional preferences (calories, protein, fat, carbs)
    max_calories = preferences.get('calories', float('inf'))
    max_protein = preferences.get('protein', float('inf'))
    max_fat = preferences.get('fat', float('inf'))
    max_carbs = preferences.get('carbs', float('inf'))

    # Filtering recipes based on nutritional preferences
    filtered_recipes = recipes_df[
        (recipes_df['calories'] <= max_calories) & 
        (recipes_df['protein'] <= max_protein) & 
        (recipes_df['fat'] <= max_fat) & 
        (recipes_df['carbs'] <= max_carbs)
    ]

    # Further filtering based on ingredients (simple string matching)
    if ingredients:
        filtered_recipes = filtered_recipes[
            filtered_recipes['ingredients'].apply(lambda x: all(ingredient.lower() in x.lower() for ingredient in ingredients))
        ]

    if filtered_recipes.empty:
        # Log and return empty result with a message
        print("No recipes found for the given preferences and ingredients.")
        return jsonify({"recipes": [], "message": "No recipes found based on the selected preferences."})

    # Returning the filtered recipes in the desired format
    recipes_list = filtered_recipes[['name', 'ingredients', 'steps']].to_dict(orient='records')
    return jsonify({"recipes": recipes_list, "message": "Recipes found successfully."})


@app.route('/api/suggestions', methods=['GET'])
def get_suggestions():
    try:
        if not json_data:
            return jsonify({"error": "No recipes available"}), 404
        
        # Retrieve the search term and pagination parameters
        search_term = request.args.get('ingredient', "").lower()
        page = max(1, int(request.args.get('page', 1)))
        limit = max(1, int(request.args.get('limit', 5)))

        # Calculate start and end indices for pagination
        start_index = (page - 1) * limit
        end_index = start_index + limit

        # Filter recipes based on search term (if provided)
        if search_term:
            filtered_recipes = [
                recipe for recipe in json_data
                if search_term in recipe['name'].lower() or
                   any(search_term in ingredient.lower() for ingredient in recipe.get('ingredients', []))
            ]
            suggestions = filtered_recipes[start_index:end_index] if filtered_recipes else random.sample(json_data, min(limit, len(json_data)))
        else:
            suggestions = random.sample(json_data, min(limit, len(json_data)))

        return jsonify(suggestions)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/search', methods=['POST'])
def search_recipes():
    data = request.json
    search_term = data.get('ingredient', "").lower()

    # Get pagination parameters (default to page 1 and 10 items per page)
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))

    # Calculate start and end indices for pagination
    start_index = (page - 1) * limit
    end_index = start_index + limit

    # Filter recipes based on the search term in their ingredients
    filtered_recipes = [
        recipe for recipe in json_data
        if any(search_term in ingredient.lower() for ingredient in recipe.get('ingredients', []))
    ]

    return jsonify(filtered_recipes[start_index:end_index])


@app.route('/api/ingredient-recipes', methods=['POST'])
def ingredient_recipes():
    data = request.json
    ingredient = data.get('ingredient', "").lower()

    # Filter recipes based on the selected ingredient
    filtered_recipes = [
        recipe for recipe in json_data
        if any(ingredient in ingredient_name.lower() for ingredient_name in recipe.get('ingredients', []))
    ]

    if not filtered_recipes:
        return jsonify({"message": "No recipes found with that ingredient"}), 404

    return jsonify(filtered_recipes)


def predict_recipes():
    preferences = request.json.get('preferences', {})

    # Extract user preferences
    preferred_calories = preferences.get('calories', 0)
    preferred_protein = preferences.get('protein', 0)
    preferred_fat = preferences.get('fat', 0)
    preferred_carbs = preferences.get('carbs', 0)
    
    # Filter recipes based on nutritional preferences
    filtered_data = data[
        (data['calories'] <= preferred_calories) & 
        (data['protein'] >= preferred_protein) & 
        (data['fat'] <= preferred_fat) & 
        (data['carbs'] <= preferred_carbs)
    ]

    if filtered_data.empty:
        return jsonify({"error": "No recipes match your criteria."}), 404

    # Prepare data for prediction
    X = filtered_data[['minutes', 'n_steps', 'name', 'calories', 'protein', 'fat', 'carbs']]
    
    # Use the model to predict the number of ingredients
    filtered_data['predicted_ingredients'] = model.predict(X)

    # Return the top recommended recipes
    recommended_recipes = filtered_data[['name', 'minutes', 'calories', 'protein', 'fat', 'carbs']].head(10)
    recommendations = recommended_recipes.to_dict(orient='records')

    return jsonify(recommendations)


if __name__ == '__main__':
    app.run(debug=True, port=5005)
