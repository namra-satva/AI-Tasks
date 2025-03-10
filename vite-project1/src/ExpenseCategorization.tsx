import React, { useState } from "react";
import axios from "axios";

const ExpenseCategorization = () => {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    if (!description.trim()) {
      setError("Please enter an expense description.");
      return;
    }
    
    setError("");
    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:5000/predict_category", { description });
      setCategory(response.data.category);
    } catch (err) {
      setError("Failed to fetch category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Expense Categorization</h2>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter expense description"
        className="border p-2 w-full mb-4"
      />
      <button
        onClick={handlePredict}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Predicting..." : "Predict Category"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {category && (
        <p className="mt-4 text-lg font-semibold">Predicted Category: <span className="text-blue-600">{category}</span></p>
      )}
    </div>
  );
};

export default ExpenseCategorization;
