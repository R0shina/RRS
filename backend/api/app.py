import pandas as pd
import os
import ast
from flask import Flask, jsonify, request
from flask_cors import CORS
import joblib
import random

app = Flask(__name__)
# Configure CORS to allow requests from all origins (suitable for development)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Paths for CSV and model
csv_path = os.path.join(os.path.dirname(__file__), '../../dataset/recipes.csv')
model_path = os.path.join(os.path.dirname(__file__), 'recipe_model.pkl')

# Load and clean the CSV data
if os.path.exists(csv_path):
    data = pd.read_csv(csv_path, quotechar='"', skipinitialspace=True)

    # Clean up data columns
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

    # Replace NaN values with an empty string
    data.fillna(value="", inplace=True)

    # Convert DataFrame to JSON for quick access
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


# Endpoint for saving recent searches
@app.route('/api/save-search', methods=['POST'])
def save_search():
    data = request.json
    if 'search_term' not in data:
        return jsonify({"error": "Missing search term"}), 400

    search_term = data['search_term']
    if search_term not in recent_searches:
        recent_searches.append(search_term)
    
    # Optional: Limit the number of stored searches
    if len(recent_searches) > 10:  # Keep the last 10 searches
        recent_searches.pop(0)

    return jsonify({"message": "Search term saved"}), 200


# Endpoint for retrieving recent searches
@app.route('/api/recent-searches', methods=['GET'])
def get_recent_searches():
    return jsonify(recent_searches)


# Endpoint for predictions
@app.route('/api/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    # Get JSON data from the request
    data = request.json

    # Ensure required fields are present
    required_fields = ['minutes', 'n_steps', 'name']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing data for prediction"}), 400

    # Prepare the input data for prediction
    input_data = pd.DataFrame({
        'minutes': [data['minutes']],
        'n_steps': [data['n_steps']],
        'name': [data['name']]
    })

    # Make predictions using the model
    prediction = model.predict(input_data)

    # Return the prediction as JSON
    return jsonify({"predicted_n_ingredients": prediction[0]})


# Endpoint for retrieving recipes based on predictions
@app.route('/api/predicted-recipes', methods=['POST'])
def predicted_recipes():
    data = request.json

    if 'predicted_n_ingredients' not in data:
        return jsonify({"error": "Missing predicted_n_ingredients in request"}), 400

    predicted_n_ingredients = data['predicted_n_ingredients']

    # Filter the recipes based on the predicted number of ingredients
    filtered_recipes = [
        recipe for recipe in json_data if recipe.get('n_ingredients') == predicted_n_ingredients
    ]

    if not filtered_recipes:
        return jsonify({"message": "No recipes found for the predicted number of ingredients"}), 404

    return jsonify(filtered_recipes)


# Endpoint for fetching recipe suggestions
@app.route('/api/suggestions', methods=['GET'])
def get_suggestions():
    try:
        if not json_data:
            return jsonify({"error": "No recipes available"}), 404
        
        search_term = request.args.get('ingredient', "").lower()  # Get the search term
        # Get pagination parameters (default to page 1 and 5 items per page)
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 5))

        # Calculate the start and end indices for the pagination
        start_index = (page - 1) * limit
        end_index = start_index + limit

        # Filter recipes based on ingredient or recent searches
        recent_suggestions = []
        if search_term:
            for search in recent_searches:
                filtered = [recipe for recipe in json_data if search_term in recipe['name'].lower()]
                recent_suggestions.extend(filtered)

            suggestions = random.sample(recent_suggestions, min(limit, len(recent_suggestions))) if recent_suggestions else random.sample(json_data, min(limit, len(json_data)))
        else:
            suggestions = random.sample(json_data, min(limit, len(json_data)))

        # Paginate the filtered suggestions
        return jsonify(suggestions[start_index:end_index])

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/search', methods=['POST'])
def search_recipes():
    data = request.json
    search_term = data.get('ingredient', "").lower()  # The partial ingredient name entered by the user
    
    # Get pagination parameters (default to page 1 and 10 items per page)
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))

    # Calculate the start and end indices for the pagination
    start_index = (page - 1) * limit
    end_index = start_index + limit

    # Filter recipes that contain the search term in their ingredients list
    filtered_recipes = [
        recipe for recipe in json_data
        if any(search_term in ingredient.lower() for ingredient in recipe.get('ingredients', []))
    ]

    # Return the filtered recipes (with pagination)
    return jsonify(filtered_recipes[start_index:end_index])


# Endpoint for retrieving recipes based on selected ingredient
@app.route('/api/ingredient-recipes', methods=['POST'])
def ingredient_recipes():
    data = request.json
    ingredient = data.get('ingredient', "").lower()

    # Filter recipes that contain the selected ingredient
    filtered_recipes = [
        recipe for recipe in json_data
        if any(ingredient in ingredient_name.lower() for ingredient_name in recipe.get('ingredients', []))
    ]

    if not filtered_recipes:
        return jsonify({"message": "No recipes found with that ingredient"}), 404

    return jsonify(filtered_recipes)


if __name__ == '__main__':
    app.run(debug=True, port=5005)  # Run the app on port 5005


# @app.route('/api/suggestions', methods=['GET'])
# def get_suggestions():
#     try:
#         if not json_data:
#             return jsonify({"error": "No recipes available"}), 404
        
#         search_term = request.args.get('ingredient', "").lower()  # Get the search term
#         recent_suggestions = []
#         for search in recent_searches:
#             filtered = [recipe for recipe in json_data if search_term in recipe['name'].lower()]
#             recent_suggestions.extend(filtered)
        
#         # Randomly sample from the filtered suggestions or use all if not enough
#         suggestions = random.sample(recent_suggestions, min(5, len(recent_suggestions))) if recent_suggestions else random.sample(json_data, min(5, len(json_data)))
        
#         return jsonify(suggestions)
    
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


# @app.route('/api/search', methods=['POST'])
# def search_recipes():
#     data = request.json
#     search_term = data.get('ingredient', "").lower()  # The partial ingredient name entered by the user

#     # Filter recipes that contain the search term in their ingredients list
#     filtered_recipes = [
#         recipe for recipe in json_data
#         if any(search_term in ingredient.lower() for ingredient in recipe.get('ingredients', []))
#     ]

#     # Return the filtered recipes (limit to 5 for performance)
#     return jsonify(filtered_recipes[:5]) if filtered_recipes else jsonify({"message": "No matching recipes found"}), 200
