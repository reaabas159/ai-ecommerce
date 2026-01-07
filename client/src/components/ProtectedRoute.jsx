import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Loader, ShieldX } from "lucide-react";
import { toast } from "react-toastify";
import { useEffect } from "react";

function ProtectedRoute({ children }) {
  const { authUser, isCheckingAuth } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check if user is authenticated and show error if admin tries to access
    if (!isCheckingAuth && authUser && authUser.role === "Admin") {
      toast.error("Admin accounts cannot access the client frontend. Please use the admin dashboard.");
    }
  }, [authUser, isCheckingAuth]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect admin users - they should use the admin dashboard
  if (authUser && authUser.role === "Admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <ShieldX className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            Admin accounts cannot access the client frontend. Please use the admin dashboard.
          </p>
          <button
            onClick={() => window.location.href = "/dashboard"}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Admin Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Allow regular users (User role) or unauthenticated users (public pages)
  return children;
}

export default ProtectedRoute;

