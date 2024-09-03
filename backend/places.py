import numpy as np
import pandas as pd
import sys

def recommend_attractions(csv_file_path, spot):
    travel_data = pd.read_csv(csv_file_path)
    travel_data['Weekly Off'].fillna('NAN', inplace=True)
    travel_data.drop('Unnamed: 0', axis=1, inplace=True)

    recommended_attractions = travel_data[(travel_data['Type'] == spot)]
    recommended_attractions = recommended_attractions.sort_values('Google review rating', ascending=False)

    selected_records = recommended_attractions[['Name', 'Type', 'State']].head().values.tolist()
    records = []
    for record in selected_records:
        mp = {"Name": record[0], "Type": record[1], "State": record[2]}
        records.append(mp)
    return records

if __name__ == "__main__":
    # Read command line arguments
    pythonScriptPath = sys.argv[0]
    csvFilePath = sys.argv[1]
    spot = sys.argv[2]
    print("sdfgfdd")
    # Call the function and get recommendations
    recommendations = recommend_attractions(csvFilePath, spot)
    print("record:", recommendations)
