import { useState } from "react";
import { X, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toggleSearchBar } from "../../store/slices/popupSlice";
import { fetchAllProducts } from "../../store/slices/productSlice";

const SearchOverlay = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSearchBarOpen } = useSelector((state) => state.popup);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(fetchAllProducts({ search: searchQuery, page: 1 }));
      dispatch(toggleSearchBar());
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  if (!isSearchBarOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20 px-4">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative">
        <button
          onClick={() => dispatch(toggleSearchBar())}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 text-black dark:text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchOverlay;
