import pandas as pd
import os
import ast
from flask import Flask, jsonify, request
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app)

# Paths for CSV and model
csv_path = os.path.join(os.path.dirname(__file__), 'dataset/recipes.csv')
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
        'name': [data['name']]  # Ensure that the 'name' feature is preprocessed or encoded as needed
    })

    # Make predictions using the model
    prediction = model.predict(input_data)

    # Return the prediction as JSON
    return jsonify({"predicted_n_ingredients": prediction[0]})


# Endpoint for retrieving recipes based on predictions
@app.route('/api/predicted-recipes', methods=['POST'])
def predicted_recipes():
    data = request.json
    print("Received data:", data)  # Debugging line

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


if __name__ == '__main__':
    app.run(debug=True, port=5005)  # Update here to run on port 5005
