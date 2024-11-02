import pandas as pd
import os
from flask import Flask, jsonify

app = Flask(__name__)

# Construct the path to the CSV file
csv_path = os.path.join(os.path.dirname(__file__), '../../dataset/recipes.csv')

# Load the dataset
df = pd.read_csv(csv_path)

# Convert relevant columns to their appropriate data types
df['ingredients'] = df['ingredients'].apply(lambda x: eval(x))  # Convert stringified lists to Python lists

@app.route('/api/recipes', methods=['GET'])
def get_recipes():
    # Get the ingredients from the query parameters
    ingredients_query = request.args.get('ingredients', '').lower().split(',')
    
    # Filter the recipes based on the ingredients
    def ingredients_match(ingredients):
        ingredients = [ingredient.lower().strip() for ingredient in ingredients]  # Normalize ingredients
        return all(ingredient in ingredients for ingredient in ingredients_query if ingredient)
    
    filtered_recipes = df[df['ingredients'].apply(ingredients_match)]
    
    # Convert filtered recipes to dictionary
    result = filtered_recipes.to_dict(orient='records')
    
    # Handle NaN values
    result = [{k: (v if v is not None else "") for k, v in recipe.items()} for recipe in result]
    
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
