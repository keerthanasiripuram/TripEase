import numpy as np
import pandas as pd 
import os
import sys

pythonScriptPath = sys.argv[0]
csvFilePath = sys.argv[1]
destination = sys.argv[2]
checkIn= sys.argv[3]
checkOut = sys.argv[4]
price=sys.argv[5]
rating=sys.argv[6]
category=sys.argv[7]

for dirname, _, filenames in os.walk('/kaggle/input'):
    for filename in filenames:
        os.path.join(dirname, filename)
df=pd.read_csv('./csv_data.csv')

missing_values = df.isnull().sum()

unique_values = df.nunique()

stat_summary = df['Total Rooms'].describe()

state_distribution = df['State'].value_counts()

category_distribution = df['Category'].value_counts()

# Converting 'Start Date' and 'Expiry Date' to datetime format
df['Start Date'] = pd.to_datetime(df['Start Date'], dayfirst=True)
df['Expiry Date'] = pd.to_datetime(df['Expiry Date'], dayfirst=True)

# Checking the distribution of the 'Alcohol' column
alcohol_distribution = df['Alcohol'].value_counts(dropna=False)

# Checking the range of 'Start Date' and 'Expiry Date'
start_date_range = df['Start Date'].min(), df['Start Date'].max()
expiry_date_range = df['Expiry Date'].min(), df['Expiry Date'].max()

df['Category'] = df['Category'].str.split(" ").str[0]

df = df.astype({'Category':'int'})
df.rename(columns={'Category':'StarRating'},inplace=True) #changing column name - category to StarRating

star_5 = df[df['StarRating']==5]

star5_viz = star_5.groupby('State').size().reset_index()
star5_viz.rename(columns={0:'Hotels'},inplace=True)

data=df.head()

def recommend_hotels(destination,rating,startDate,endDate,price):
    dummy=df[df['StarRating']==rating]
    recommended_hotels = df[ (df['City'] == destination) & (df['StarRating'] == rating) &( startDate>=df['Start Date']) 
    & (endDate <= df['Expiry Date']) &  (df['price'] == price)]
    recommended_hotels = recommended_hotels.sort_values('Alcohol', ascending=False)
    selected_records = recommended_hotels[['Hotel Name', 'Address','Total Rooms']].head().values.tolist()
    return selected_records
recommendations=recommend_hotels(destination,int(rating),checkIn,checkOut,int(price))

records=[]
for record in recommendations:
    mp={}
    mp["Hotel_Name"]=record[0]
    mp["Address"]=record[1]
    mp["Total_Rooms"]=record[2]
    records.append(mp)
print(records)
