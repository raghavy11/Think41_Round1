import React, { useState } from "react";
import axios from "axios";

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleQuery = async () => {
    setResponse(null);
    setError(null);
    const query = input.toLowerCase();





    try {
      if (query.includes("top 5") || query.includes("most sold")) {
        const res = await axios.get("http://localhost:5000/api/top-products");
        setResponse(res.data);
      } else if (query.includes("status of order")) {
        const match = query.match(/(\d{5,})/);
        if (match) {
          const res = await axios.get(`http://localhost:5000/api/order/${match[1]}`);
          setResponse(res.data);
        } else {
          setError("Order ID not found in your query.");
        }
      } else if (query.includes("how many") || query.includes("stock")) {
        const match = query.match(/(?:how many|stock of|stock for)\s(.+?)(?:\?|$| in stock| are left)?/);
        const product = match?.[1];
        if (product) {
          const res = await axios.get(`http://localhost:5000/api/stock/${product}`);
          setResponse(res.data);
        } else {
          setError("Product name not found in your query.");
        }
      } else {
        setError("Sorry, I didn’t understand that. Try asking about top products, orders, or stock.");
      }
    } catch (err) {
      setError("Something went wrong. Please check the server and try again.");
    }
  };





  
  return (
    <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-2xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-indigo-600">E-commerce Chatbot</h2>
        
        <input
          type="text"
          value={input}
          placeholder="Ask me something like: Top 5 most sold products"
          onChange={(e) => setInput(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring focus:ring-indigo-300"
        />
        <button
          onClick={handleQuery}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded w-full"
        >
          Ask
        </button>

        <div className="mt-6">
          {error && (
            <div className="text-red-600 font-medium mb-2">
              ❌ {error}
            </div>
          )}

          {response && (
            <div className="bg-gray-50 border border-gray-200 rounded p-4">
              <h4 className="font-semibold text-gray-700 mb-2">Response:</h4>
              {Array.isArray(response) ? (
                <ul className="list-disc pl-5 space-y-1 text-gray-800">
                  {response.map((item, idx) => (
                    <li key={idx}>
                      <strong>{item.name}</strong> - Sold: {item.units_sold}, Stock: {item.stock}
                    </li>
                  ))}
                </ul>
              ) : (
                <pre className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                  {JSON.stringify(response, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
