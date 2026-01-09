import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CreditCard, Lock, Loader } from "lucide-react";
import { toast } from "react-toastify";

const PaymentForm = ({ clientSecret, onSuccess, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    const { error: stripeError, paymentIntent } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

    if (stripeError) {
      setError(stripeError.message);
      setProcessing(false);
      toast.error(stripeError.message);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      toast.success("Payment successful!");
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/orders");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          <span className="text-xs sm:text-sm text-gray-600">
            Secure payment powered by Stripe
          </span>
        </div>
        <div className="border border-gray-300 rounded-lg p-3 sm:p-4 bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "14px",
                  color: "#424770",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
        </div>
        {error && (
          <p className="text-red-600 text-xs sm:text-sm mt-2">{error}</p>
        )}
      </div>

      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm sm:text-base text-gray-600">Amount</span>
          <span className="text-xl sm:text-2xl font-bold text-gray-900">
            ${parseFloat(amount || 0).toFixed(2)}
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm sm:text-base"
      >
        {processing ? (
          <>
            <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
            Pay ${parseFloat(amount || 0).toFixed(2)}
          </>
        )}
      </button>
    </form>
  );
};

export default PaymentForm;
