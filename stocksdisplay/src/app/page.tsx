"use client"

import { useState } from "react"
import { X, RefreshCw } from "lucide-react"
import Image from "next/image"
import { error } from "console"

// Simulated stock data
const stocks = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "AMZN", name: "Amazon.com, Inc." },
  { symbol: "JPM", name: "JPMorgan Chase & Co." },
  { symbol: "TSLA", name: "Tesla, Inc." },
  { symbol: "BRK.B", name: "Berkshire Hathaway Inc." },
  { symbol: "V", name: "Visa Inc." },
];


// Simulated API call
const fetchStockInfo = async (symbol: string) => {
 try{
  const response = await fetch(`http://127.0.0.1:5000/api/stocks/${symbol}`);  
  if (!response.ok){
    console.log('Failed to fetch data')
    throw new Error('Failed to fetch data')

  }
  const stockData=await response.json()
  return{
    symbol:stockData.ticker || symbol,
    outstanding_shares:stockData.shareOutstanding || 'N/A',
    Industry:stockData.finnhubIndustry || 'Unknown',
    MarketCap:stockData.marketCapitalization || 'N/A',
    logo:stockData.logo || ""

  }
}
catch(error){
  console.error('Error fetching stock info,error')
  return null;
}
  
}

// const fetch_new_stock=fetch('https://finnhub.io/api/v1/stock/profile2?symbol=AAPL&token=cs3r5j1r01qkg08jeqv0cs3r5j1r01qkg08jeqvg')
// console.log(fetch_new_stock)
export default function StockInfoPage() {
  const [selectedStock, setSelectedStock] = useState<string | null>(null)
  const [stockInfo, setStockInfo] = useState<any>(null)

  const handleStockClick = async (symbol: string) => {
    setSelectedStock(symbol)
    const info = await fetchStockInfo(symbol)
    setStockInfo(info)
  }

  const handleExit = () => {
    setSelectedStock(null)
    setStockInfo(null)
  }

  const handleRerun = async () => {
    if (selectedStock) {
      const info = await fetchStockInfo(selectedStock)
      setStockInfo(info)
    }
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-700 p-4 bg-gray-800">
        <h2 className="text-xl font-bold mb-4 text-blue-300">Stocks</h2>
        <ul className="space-y-2">
          {stocks.map((stock) => (
            <li
              key={stock.symbol}
              className={`cursor-pointer p-2 hover:bg-gray-700 rounded transition-colors ${
                selectedStock === stock.symbol ? "bg-blue-600" : ""
              }`}
              onClick={() => handleStockClick(stock.symbol)}
            >
              {stock.symbol} - {stock.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 relative">
        {/* Exit and Rerun buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={handleExit}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded"
            aria-label="Exit"
          >
            <X className="h-4 w-4" />
          </button>
          <button
            onClick={handleRerun}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded"
            aria-label="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {/* Stock information */}
        {stockInfo ? (
          <div className="mt-12 bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-3xl font-bold text-blue-300 text-center mb-6">
              {stockInfo.symbol} Stock Information
            </h2>
            <div className="flex flex-col items-center">
              <Image
                src={stockInfo.logo}
                alt={`${stockInfo.symbol} logo`}
                width={200}
                height={200}
                className="mb-6 rounded-full"
              />
              <div className="text-center space-y-4">
                <p className="text-xl">
                  Market Capitalization: <span className="text-green-400">${stockInfo.MarketCap}</span>
                </p>
                <p className="text-xl">
                  Outstanding Shares: <span className={stockInfo.Outstanding_shares? "text-green-400" : "text-red-400"}>{stockInfo.outstanding_shares}</span>
                </p>
                <p className="text-xl">
                  Stock Industry: <span className="text-blue-300">{stockInfo.Industry}</span>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-400 text-xl">Select a stock to view information</p>
          </div>
        )}
      </div>
    </div>
  )
}