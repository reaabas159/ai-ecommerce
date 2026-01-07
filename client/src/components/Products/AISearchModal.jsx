import React, { useState } from "react";
import { X, Sparkles, Loader } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { aiSearchProducts } from "../../store/slices/productSlice";

const AISearchModal = ({ onClose, onSearch }) => {
  const [prompt, setPrompt] = useState("");
  const dispatch = useDispatch();
  const { aiSearching } = useSelector((state) => state.product);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      if (onSearch) {
        onSearch(prompt);
      } else {
        dispatch(aiSearchProducts(prompt));
        onClose();
      }
      setPrompt("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">AI Product Search</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you're looking for... e.g., 'Find headphones under $100 with good bass'"
            className="w-full px-4 py-3 border border-gray-300 text-black dark:text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4 resize-none"
            rows={4}
            disabled={aiSearching}
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              disabled={aiSearching}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!prompt.trim() || aiSearching}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {aiSearching ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Search
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AISearchModal;
