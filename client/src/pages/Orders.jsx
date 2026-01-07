import React, { useEffect } from "react";
import { Package, Truck, CheckCircle, XCircle, Loader } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMyOrders } from "../store/slices/orderSlice";

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { myOrders, fetchingOrders } = useSelector((state) => state.order);
  const { authUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!authUser) {
      navigate("/");
      return;
    }
    dispatch(fetchMyOrders());
  }, [dispatch, authUser, navigate]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "Shipped":
        return <Truck className="w-5 h-5 text-blue-600" />;
      case "Processing":
        return <Package className="w-5 h-5 text-yellow-600" />;
      case "Cancelled":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (fetchingOrders) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Orders</h1>

        {myOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">No orders yet</p>
            <button
              onClick={() => navigate("/products")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {myOrders.map((order) => {
              const orderItems =
                Array.isArray(order.order_items) && order.order_items.length > 0
                  ? order.order_items
                  : [];
              const shippingInfo = order.shipping_info || {};
              const orderDate = new Date(order.created_at).toLocaleDateString();

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex items-center justify-between mb-4 pb-4 border-b">
                    <div>
                      <p className="text-sm text-gray-600">Order ID</p>
                      <p className="font-semibold text-gray-900">
                        {order.id.slice(0, 8)}...
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Order Date</p>
                      <p className="font-semibold text-gray-900">
                        {orderDate}
                      </p>
                    </div>
                    <div
                      className={`px-4 py-2 rounded-full flex items-center gap-2 ${getStatusColor(
                        order.order_status
                      )}`}
                    >
                      {getStatusIcon(order.order_status)}
                      <span className="font-semibold">
                        {order.order_status}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Order Items
                    </h3>
                    <div className="space-y-2">
                      {orderItems.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                        >
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {item.title}
                            </p>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity} × ${parseFloat(item.price).toFixed(2)}
                            </p>
                          </div>
                          <p className="font-semibold text-gray-900">
                            ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Shipping Address
                      </h3>
                      <p className="text-sm text-gray-600">
                        {shippingInfo.full_name}
                        <br />
                        {shippingInfo.address}
                        <br />
                        {shippingInfo.city}, {shippingInfo.state}{" "}
                        {shippingInfo.pincode}
                        <br />
                        {shippingInfo.country}
                        <br />
                        Phone: {shippingInfo.phone}
                      </p>
                    </div>
                    <div className="text-right md:text-left">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Order Summary
                      </h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="text-gray-900">
                            ${(parseFloat(order.total_price) - parseFloat(order.tax_price || 0) - parseFloat(order.shipping_price || 0)).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax:</span>
                          <span className="text-gray-900">
                            ${parseFloat(order.tax_price || 0).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping:</span>
                          <span className="text-gray-900">
                            ${parseFloat(order.shipping_price || 0).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t font-semibold">
                          <span className="text-gray-900">Total:</span>
                          <span className="text-blue-600">
                            ${parseFloat(order.total_price).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {order.paid_at ? (
                    <p className="text-sm text-green-600 font-semibold">
                      ✓ Paid on {new Date(order.paid_at).toLocaleDateString()}
                    </p>
                  ) : (
                    <p className="text-sm text-yellow-600 font-semibold">
                      ⚠ Payment Pending
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
