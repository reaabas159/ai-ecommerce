import { useState, useEffect } from "react";
import { ArrowLeft, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "../components/PaymentForm";
import { loadStripe } from "@stripe/stripe-js";
import { placeNewOrder, clearOrder } from "../store/slices/orderSlice";
import { clearCart } from "../store/slices/cartSlice";

// Stripe publishable key - should be in env in production
const stripePromise = loadStripe(
  "pk_test_51SmapmD9qq75E7ykOQl96DZie4ZlGwssvQWQEgi3uvI7hLCTd9rmBP4Z7XR1VlNpmc3Kq7R02KzQx8sABMf0nMIS00JKFfTZJ4"
);

const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const { authUser } = useSelector((state) => state.auth);
  const { paymentIntent, placingOrder, finalPrice } = useSelector(
    (state) => state.order
  );
  const [shippingInfo, setShippingInfo] = useState({
    full_name: "",
    state: "",
    city: "",
    country: "",
    address: "",
    pincode: "",
    phone: "",
  });
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!authUser) {
      navigate("/");
      return;
    }
    if (cart.length === 0) {
      navigate("/cart");
      return;
    }
    // Clear any previous order state
    dispatch(clearOrder());
  }, [authUser, cart, navigate, dispatch]);

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      // Place order first
      const orderedItems = cart.map((item) => ({
        product: {
          id: item.id,
          images: [{ url: item.image }],
        },
        quantity: item.quantity,
      }));

      dispatch(
        placeNewOrder({
          ...shippingInfo,
          orderedItems,
        })
      ).then((action) => {
        if (action.type === "order/placeNew/fulfilled") {
          setStep(2);
        }
      });
    }
  };

  const handlePaymentSuccess = () => {
    dispatch(clearCart());
    dispatch(clearOrder());
    navigate("/orders");
  };

  if (placingOrder && step === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Cart
        </Link>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1 ? "bg-blue-600 text-white" : "bg-gray-300"
                }`}
              >
                1
              </div>
              <div className="w-16 h-1 bg-gray-300">
                <div
                  className={`h-full ${
                    step >= 2 ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  style={{ width: step >= 2 ? "100%" : "0%" }}
                />
              </div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2 ? "bg-blue-600 text-white" : "bg-gray-300"
                }`}
              >
                2
              </div>
            </div>
          </div>

          {step === 1 ? (
            <form onSubmit={handleShippingSubmit} className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Shipping Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={shippingInfo.full_name}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, full_name: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 text-black dark:text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="State"
                  required
                  value={shippingInfo.state}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, state: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 text-black dark:text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="City"
                  required
                  value={shippingInfo.city}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, city: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 text-black dark:text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Country"
                  required
                  value={shippingInfo.country}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, country: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 text-black dark:text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Address"
                  required
                  value={shippingInfo.address}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, address: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 text-black dark:text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
                />
                <input
                  type="number"
                  placeholder="Pincode"
                  required
                  value={shippingInfo.pincode}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, pincode: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 text-black dark:text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  required
                  value={shippingInfo.phone}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, phone: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 text-black dark:text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mt-6">
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  Total: ${finalPrice || cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0).toFixed(2)}
                </p>
                <button
                  type="submit"
                  disabled={placingOrder}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {placingOrder ? "Processing..." : "Continue to Payment"}
                </button>
              </div>
            </form>
          ) : (
            paymentIntent && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Payment
                </h2>
                <Elements stripe={stripePromise}>
                  <PaymentForm
                    clientSecret={paymentIntent}
                    onSuccess={handlePaymentSuccess}
                    amount={finalPrice}
                  />
                </Elements>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
