import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  Plus,
  Minus,
  Loader,
  ArrowLeft,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import ReviewsContainer from "../components/Products/ReviewsContainer";
import {
  fetchSingleProduct,
  postReview,
  clearProductDetails,
} from "../store/slices/productSlice";
import { addToCart } from "../store/slices/cartSlice";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { productDetails, loading, isPostingReview, productReviews } =
    useSelector((state) => state.product);
  const { authUser } = useSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleProduct(id));
    }
    return () => {
      dispatch(clearProductDetails());
    };
  }, [id, dispatch]);

  const images =
    Array.isArray(productDetails.images) && productDetails.images.length > 0
      ? productDetails.images
      : [{ url: "/placeholder.jpg" }];
  const price = parseFloat(productDetails.price) || 0;
  const rating = parseFloat(productDetails.ratings) || 0;
  const stock = productDetails.stock || 0;

  const handleAddToCart = () => {
    if (stock === 0) return;
    dispatch(
      addToCart({
        id: productDetails.id,
        name: productDetails.name,
        price: price,
        image: images[0]?.url,
        stock: stock,
        quantity: quantity,
      })
    );
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!authUser) {
      alert("Please login to post a review");
      return;
    }
    dispatch(
      postReview({
        productId: id,
        rating: reviewRating,
        comment: reviewComment,
      })
    ).then(() => {
      setShowReviewForm(false);
      setReviewComment("");
      dispatch(fetchSingleProduct(id));
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!productDetails.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Product not found</p>
          <button
            onClick={() => navigate("/products")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div>
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={images[selectedImageIndex]?.url || images[0]?.url}
                  alt={productDetails.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImageIndex === index
                          ? "border-blue-600"
                          : "border-gray-200"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={`${productDetails.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {productDetails.name}
              </h1>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-medium text-gray-700">
                  {rating.toFixed(1)}
                </span>
                <span className="text-gray-500">
                  ({productReviews?.length || 0} reviews)
                </span>
              </div>

              <p className="text-2xl font-bold text-blue-600 mb-4">
                ${price.toFixed(2)}
              </p>

              <p className="text-gray-700 mb-6">{productDetails.description}</p>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">Category:</span>{" "}
                  {productDetails.category}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Stock:</span>{" "}
                  {stock > 0 ? (
                    <span className="text-green-600">{stock} available</span>
                  ) : (
                    <span className="text-red-600">Out of stock</span>
                  )}
                </p>
              </div>

              {/* Quantity and Add to Cart */}
              {stock > 0 && (
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 text-black dark:text-black border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-100"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2">{quantity}</span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(stock, quantity + 1))
                      }
                      className="p-2 hover:bg-gray-100"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
            {authUser && stock > 0 && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {showReviewForm ? "Cancel" : "Write a Review"}
              </button>
            )}
          </div>

          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewRating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 text-black dark:text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write your review..."
                />
              </div>
              <button
                type="submit"
                disabled={isPostingReview}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isPostingReview ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}

          <ReviewsContainer
            product={productDetails}
            productReviews={productReviews || []}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
