import React from "react";
import { Star, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const images = Array.isArray(product.images) ? product.images : [];
  const mainImage = images[0]?.url || "/placeholder.jpg";
  const rating = parseFloat(product.ratings) || 0;
  const price = parseFloat(product.price) || 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: price,
        image: mainImage,
        stock: product.stock,
        quantity: 1,
      })
    );
  };

  return (
    <Link to={`/product/${product.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          {product.stock === 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
              Out of Stock
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-700">
              {rating.toFixed(1)}
            </span>
            <span className="text-sm text-gray-500">
              ({product.review_count || 0})
            </span>
          </div>

          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-blue-600">
              ${price.toFixed(2)}
            </span>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
