import React from "react";
import { useSelector } from "react-redux";

const TopSellingProducts = () => {
  const { topSellingProducts } = useSelector((state) => state.admin);

  if (!Array.isArray(topSellingProducts) || topSellingProducts.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="font-semibold mb-4 text-gray-900">Top Selling Products</h3>
        <p className="text-gray-500 text-center py-8">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="font-semibold mb-4 text-gray-900">Top Selling Products</h3>
      <div className="space-y-4">
        {topSellingProducts.map((product, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
          >
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center font-bold text-gray-600">
              {index + 1}
            </div>
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 object-cover rounded"
              />
            )}
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{product.name}</h4>
              <p className="text-sm text-gray-600">{product.category}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-yellow-600">
                  ⭐ {parseFloat(product.ratings || 0).toFixed(1)}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">
                {product.total_sold || 0}
              </p>
              <p className="text-sm text-gray-600">sold</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSellingProducts;
