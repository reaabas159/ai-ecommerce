import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleCart } from "../../store/slices/popupSlice";
import { removeFromCart, updateQuantity } from "../../store/slices/cartSlice";

const CartSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isCartOpen } = useSelector((state) => state.popup);
  const { cart } = useSelector((state) => state.cart);
  const { authUser } = useSelector((state) => state.auth);

  const subtotal = cart.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (!authUser) {
      dispatch(toggleCart());
      // Open login modal - you might want to add this action
      return;
    }
    dispatch(toggleCart());
    navigate("/cart");
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
          <button
            onClick={() => dispatch(toggleCart())}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <Link
              to="/products"
              onClick={() => dispatch(toggleCart())}
              className="text-blue-600 hover:text-blue-700"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="p-4 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-blue-600 font-semibold mb-2">
                      ${parseFloat(item.price).toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 border border-gray-300 rounded">
                        <button
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                id: item.id,
                                quantity: item.quantity - 1,
                              })
                            )
                          }
                          className="p-1 hover:bg-gray-200"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-2 text-sm">{item.quantity}</span>
                        <button
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                id: item.id,
                                quantity: item.quantity + 1,
                              })
                            )
                          }
                          disabled={item.quantity >= item.stock}
                          className="p-1 hover:bg-gray-200 disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="sticky bottom-0 bg-white border-t p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-xl font-bold text-gray-900">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                Checkout
                <ArrowRight className="w-5 h-5" />
              </button>
              <Link
                to="/cart"
                onClick={() => dispatch(toggleCart())}
                className="block text-center mt-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                View Cart
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;
