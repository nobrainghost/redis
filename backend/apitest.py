import requests
def fetch_stock_info(symbol):
    url=f"https://finnhub.io/api/v1/stock/profile2?symbol={symbol}&token=cs3r5j1r01qkg08jeqv0cs3r5j1r01qkg08jeqvg"
    response=requests.get(url).text

fetch_stock_info("AAPL")