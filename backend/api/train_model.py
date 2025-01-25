import pandas as pd
import os
import ast
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.preprocessing import LabelEncoder
import joblib

csv_path = os.path.join(os.path.dirname(__file__), '../../dataset/recipes.csv')

if os.path.exists(csv_path):
    data = pd.read_csv(csv_path, quotechar='"', skipinitialspace=True)

    for column in ['contributor_id', 'description', 'id', 'ingredients',
                   'minutes', 'n_ingredients', 'n_steps', 'name', 'nutrition', 'steps', 'submitted', 'tags']:
        if column in data.columns:
            data[column] = data[column].apply(lambda x: x.strip().strip("'") if isinstance(x, str) else x)

    def parse_list(x):
        try:
            return ast.literal_eval(x) if isinstance(x, str) and x.startswith('[') else x
        except (ValueError, SyntaxError):
            return []

    data['ingredients'] = data['ingredients'].apply(parse_list)
    data['steps'] = data['steps'].apply(parse_list)
    data['tags'] = data['tags'].apply(parse_list)
    data['nutrition'] = data['nutrition'].apply(lambda x: parse_list(x) or [0] * 7)

    data.fillna(value="", inplace=True)

    le_name = LabelEncoder()
    if 'name' in data.columns:
        data['name'] = le_name.fit_transform(data['name'].astype(str))

    data[['calories', 'protein', 'fat', 'carbs']] = pd.DataFrame(data['nutrition'].tolist(), index=data.index)[[0, 1, 2, 3]]

    X = data[['minutes', 'n_steps', 'name', 'calories', 'protein', 'fat', 'carbs']]
    y = data['n_ingredients']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = RandomForestRegressor(n_estimators=100, max_depth=None, random_state=42)
    model.fit(X_train, y_train)

    scores = cross_val_score(model, X, y, cv=5, scoring='r2')
    print(f"Cross-validated R-squared scores: {scores}")
    print(f"Mean R-squared: {scores.mean()}")

    y_pred = model.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    print(f"Mean Squared Error: {mse}")
    print(f"R-squared: {r2}")

    importances = model.feature_importances_
    feature_names = X.columns
    print("Feature importances:", dict(zip(feature_names, importances)))

    model_path = os.path.join(os.path.dirname(__file__), 'recipe_model.pkl')
    joblib.dump(model, model_path)
    print(f"Model saved to: {model_path}")

    encoder_path = os.path.join(os.path.dirname(__file__), 'label_encoder.pkl')
    joblib.dump(le_name, encoder_path)
    print(f"Label encoder saved to: {encoder_path}")

else:
    print(f"File not found: {csv_path}")
