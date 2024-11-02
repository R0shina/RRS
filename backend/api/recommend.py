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
df = pd.read_csv(csv_path)

# Create TF-IDF vectorizer
tfidf_vectorizer = TfidfVectorizer()
tfidf_matrix = tfidf_vectorizer.fit_transform(df['ingredients'].astype(str))

@app.route('/api/recommend', methods=['POST'])
def recommend():
    # Get ingredients from request
    ingredients_query = request.json.get('ingredients', [])
    
    # Check if ingredients are provided
    if not ingredients_query:
        return jsonify({'error': 'No ingredients provided'}), 400  # Bad request if no ingredients
    
    ingredients_query_str = ' '.join(ingredients_query)

    # Transform the ingredients into the same TF-IDF space
    query_vector = tfidf_vectorizer.transform([ingredients_query_str])
    
    # Calculate cosine similarity
    cosine_similarities = cosine_similarity(query_vector, tfidf_matrix).flatten()
    
    # Get the indices of the top 5 similar recipes
    similar_indices = cosine_similarities.argsort()[-5:][::-1]
    
    # Fetch the recommended recipes
    recommended_recipes = df.iloc[similar_indices].to_dict(orient='records')

    return jsonify(recommended_recipes)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
