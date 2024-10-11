from flask import Flask, jsonify, request
import redis
import json
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def fetch_stock_info(symbol):
    print("Not in cache, hitting the API")
    url = f"https://finnhub.io/api/v1/stock/profile2?symbol={symbol}&token=cs3r5j1r01qkg08jeqv0cs3r5j1r01qkg08jeqvg"
    response = requests.get(url)
    
    # Ensure the response is JSON
    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch data from API"}), 500
    
    stock_data = response.json()  # Parse JSON directly

    # Store the stock data in Redis as a JSON string
    redis_client.set(symbol, json.dumps(stock_data))

    return stock_data  # Return the stock data directly


@app.route('/api/stocks/<symbol>', methods=['GET'])
def get_stocks(symbol):
    cached_stocks = redis_client.get(symbol)
    
    if cached_stocks:
        print("Fetching from cache....")
        return jsonify(json.loads(cached_stocks))
        
    stock_info = fetch_stock_info(symbol)
    return jsonify(stock_info)  # Return the stock data directly

if __name__ == "__main__":
    app.run(debug=True)
