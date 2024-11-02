import pandas as pd
import os
import ast
from flask import Flask, jsonify, request
from flask_cors import CORS  # Import CORS
import joblib  # Import joblib to load the model

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Construct the path to the CSV file
csv_path = os.path.join(os.path.dirname(__file__), '../../dataset/recipes.csv')
model_path = os.path.join(os.path.dirname(__file__), 'recipe_model.pkl')  # Update model path

# Load the CSV file with proper handling of quotes
if os.path.exists(csv_path):
    # Read the CSV file
    data = pd.read_csv(csv_path, quotechar='"', skipinitialspace=True)

    # Clean up the data by stripping extra quotes and spaces
    for column in ['contributor_id', 'description', 'id', 'ingredients',
                   'minutes', 'n_ingredients', 'n_steps',
                   'name', 'nutrition', 'steps', 'submitted', 'tags']:
        if column in data.columns:
            data[column] = data[column].apply(lambda x: x.strip().strip("'") if isinstance(x, str) else x)

    # Ensure that stringified lists are properly parsed
    data['ingredients'] = data['ingredients'].apply(lambda x: ast.literal_eval(x) if isinstance(x, str) and x.startswith('[') else x)
    data['steps'] = data['steps'].apply(lambda x: ast.literal_eval(x) if isinstance(x, str) and x.startswith('[') else x)
    data['tags'] = data['tags'].apply(lambda x: ast.literal_eval(x) if isinstance(x, str) and x.startswith('[') else x)

    # Replace NaN values with an empty string
    data.fillna(value="", inplace=True)

    # Convert the DataFrame to JSON format
    json_data = data.to_dict(orient='records')

    @app.route('/api/recipes', methods=['GET'])
    def get_recipes():
        print(json_data)  # Debugging line to check the data
        return jsonify(json_data)

else:
    print(f"File not found: {csv_path}")

# Load the trained model
try:
    model = joblib.load(model_path)
    print("Model loaded successfully!")
except FileNotFoundError:
    print(f"Model not found: {model_path}")


# Prediction endpoint
@app.route('/api/predict', methods=['POST'])
def predict():
    # Get JSON data from the request
    data = request.json

    # Ensure required fields are present
    if not all(key in data for key in ['minutes', 'n_steps', 'name']):
        return jsonify({"error": "Missing data for prediction"}), 400

    # Prepare the input data for prediction
    input_data = pd.DataFrame({
        'minutes': [data['minutes']],
        'n_steps': [data['n_steps']],
        'name': [data['name']]  # Ensure this is the encoded form or mapping
    })

    # Make predictions using the loaded model
    prediction = model.predict(input_data)

    # Return the prediction as JSON
    return jsonify({"predicted_n_ingredients": prediction[0]})


if __name__ == '__main__':
    app.run(debug=True)
