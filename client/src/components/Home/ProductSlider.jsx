import { useRef } from "react";
import { ChevronLeft, ChevronRight, Star, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { addToCart } from "../../store/slices/cartSlice";
import { useDispatch } from "react-redux";

const ProductSlider = ({ title, products }) => {
  const scrollRef = useRef(null);
  const dispatch = useDispatch();

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product) => {
          const images = Array.isArray(product.images) ? product.images : [];
          const mainImage = images[0]?.url || "/placeholder.jpg";
          const rating = parseFloat(product.ratings) || 0;
          const price = parseFloat(product.price) || 0;

          return (
            <div
              key={product.id}
              className="flex-shrink-0 w-64 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <Link to={`/product/${product.id}`}>
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={mainImage}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-700">
                      {rating.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-600">
                      ${price.toFixed(2)}
                    </span>
                    <button
                      onClick={(e) => {
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
                      }}
                      disabled={product.stock === 0}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductSlider;
