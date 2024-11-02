import pandas as pd
import os
import ast
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.preprocessing import LabelEncoder
import joblib

# Step 1: Load the dataset
csv_path = os.path.join(os.path.dirname(__file__), '../../dataset/recipes.csv')

if os.path.exists(csv_path):
    # Read the CSV file
    data = pd.read_csv(csv_path, quotechar='"', skipinitialspace=True)

    # Step 2: Preprocess the data
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

    # Optimize data types
    data['minutes'] = data['minutes'].astype('int32')
    data['n_steps'] = data['n_steps'].astype('int32')
    data['n_ingredients'] = data['n_ingredients'].astype('int32')

    # Encode categorical features
    le_name = LabelEncoder()
    if 'name' in data.columns:
        data['name'] = le_name.fit_transform(data['name'].astype(str))

    # Step 3: Define features and target
    X = data[['minutes', 'n_steps', 'name']]
    y = data['n_ingredients']

    # Split the data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Step 4: Train a RandomForestRegressor model
    model = RandomForestRegressor(n_estimators=50, max_depth=10, random_state=42)  # Adjusted model parameters
    model.fit(X_train, y_train)

    # Step 5: Make predictions on the test set
    y_pred = model.predict(X_test)

    # Step 6: Evaluate the model
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    print(f"Mean Squared Error: {mse}")
    print(f"R-squared: {r2}")

    # Save the model
    model_path = os.path.join(os.path.dirname(__file__), 'recipe_model.pkl')
    joblib.dump(model, model_path)
    print(f"Model saved to: {model_path}")

else:
    print(f"File not found: {csv_path}")
