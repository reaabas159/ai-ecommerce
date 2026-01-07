import React, { useState } from "react";
import { Star, Edit2, Trash2, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { deleteReview, postReview, fetchSingleProduct } from "../../store/slices/productSlice";
import { useParams } from "react-router-dom";

const ReviewsContainer = ({ product, productReviews }) => {
  const { authUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { id: productId } = useParams();
  const reviews = Array.isArray(productReviews) ? productReviews : [];
  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      await dispatch(deleteReview(productId));
      dispatch(fetchSingleProduct(productId));
    }
  };

  const handleStartEdit = (review) => {
    setEditingReview(review.review_id);
    setEditRating(review.rating || 5);
    setEditComment(review.comment || "");
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setEditRating(5);
    setEditComment("");
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    await dispatch(
      postReview({
        productId,
        rating: editRating,
        comment: editComment,
      })
    );
    dispatch(fetchSingleProduct(productId));
    setEditingReview(null);
    setEditRating(5);
    setEditComment("");
  };

  const isUserReview = (review) => {
    return authUser && review.reviewer && review.reviewer.id === authUser.id;
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const reviewer = review.reviewer || {};
        const avatar = reviewer.avatar?.url || "/avatar-holder.avif";
        const rating = review.rating || 0;
        const isEditing = editingReview === review.review_id;
        const canEdit = isUserReview(review);

        return (
          <div key={review.review_id} className="border-b border-gray-200 pb-4">
            <div className="flex items-start gap-4">
              <img
                src={avatar}
                alt={reviewer.name || "User"}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">
                      {reviewer.name || "Anonymous"}
                    </h4>
                    {!isEditing && (
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  {canEdit && !isEditing && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStartEdit(review)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Edit review"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review.review_id)}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Delete review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                {isEditing ? (
                  <form onSubmit={handleSubmitEdit} className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rating
                      </label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setEditRating(star)}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                star <= editRating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Comment
                      </label>
                      <textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        required
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Update Review
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <p className="text-gray-700">{review.comment}</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReviewsContainer;
