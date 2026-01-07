import React from "react";
import { useDispatch } from "react-redux";
import { toggleViewProductModal } from "../store/slices/extraSlice";

const ViewProductModal = ({ selectedProduct }) => {
  const dispatch = useDispatch();
  return (
    <>
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-xl w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh] relative">
          <button
            onClick={() => dispatch(toggleViewProductModal())}
            className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-xl"
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold mb-4">{selectedProduct.name}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Images */}
            <div className="grid grid-cols-2 gap-3">
              {Array.isArray(selectedProduct.images) &&
              selectedProduct.images.length > 0 ? (
                selectedProduct.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img?.url || img}
                    alt={`Product ${idx}`}
                    className="w-full h-full object-cover rounded"
                  />
                ))
              ) : (
                <div className="col-span-2 bg-gray-100 rounded flex items-center justify-center h-48">
                  <p className="text-gray-500">No images</p>
                </div>
              )}
            </div>
            {/* Info */}
            <div className="space-y-2">
              <p>
                <strong>ID:</strong> {selectedProduct.id}
              </p>
              <p>
                <strong>Description:</strong> {selectedProduct.description}
              </p>
              <p>
                <strong>Category:</strong> {selectedProduct.category}
              </p>
              <p>
                <strong>Price:</strong> ${parseFloat(selectedProduct.price || 0).toFixed(2)}
              </p>
              <p>
                <strong>Ratings:</strong> ⭐ {parseFloat(selectedProduct.ratings || 0).toFixed(1)}
              </p>
              <p>
                <strong>Stock:</strong>{" "}
                {selectedProduct.stock > 0
                  ? `In Stock (${selectedProduct.stock})`
                  : "Out of Stock"}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(selectedProduct.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewProductModal;
