import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "./components/SideBar";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./components/Dashboard";
import Products from "./components/Products";
import Orders from "./components/Orders";
import Users from "./components/Users";
import Profile from "./components/Profile";
import { ToastContainer } from "react-toastify";
import { getCurrentUser, clearAuth } from "./store/slices/authSlice";
import { setOpenedComponent } from "./store/slices/extraSlice";
import { setupAxiosInterceptors } from "./lib/axios";
import { store } from "./store/store";

function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isCheckingAuth } = useSelector(
    (state) => state.auth
  );

  // Clear auth state if non-admin user tries to access
  useEffect(() => {
    if (!isCheckingAuth && isAuthenticated && user && user.role !== "Admin") {
      dispatch(clearAuth());
    }
  }, [dispatch, isCheckingAuth, isAuthenticated, user]);

  // Wait for auth check to complete
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Show error message for non-admin users (must check AFTER authentication check)
  if (user && user.role !== "Admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <svg
            className="w-16 h-16 text-red-600 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            Only admin accounts can access the dashboard. Please use the client frontend.
          </p>
          <button
            onClick={() => window.location.href = "/"}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Client Frontend
          </button>
        </div>
      </div>
    );
  }

  // Only render children if user is authenticated AND is Admin
  if (!user || user.role !== "Admin") {
    return null; // Don't render anything if role check fails
  }

  return children;
}

function DashboardLayout() {
  const dispatch = useDispatch();
  const { openedComponent } = useSelector((state) => state.extra);

  useEffect(() => {
    if (!openedComponent) {
      dispatch(setOpenedComponent("Dashboard"));
    }
  }, [dispatch, openedComponent]);

  const renderContent = () => {
    switch (openedComponent) {
      case "Dashboard":
        return <Dashboard />;
      case "Products":
        return <Products />;
      case "Orders":
        return <Orders />;
      case "Users":
        return <Users />;
      case "Profile":
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <SideBar />
      <div className="flex-1 overflow-x-hidden">{renderContent()}</div>
    </div>
  );
}

function App() {
  const dispatch = useDispatch();

  // Setup axios interceptors once when app loads
  useEffect(() => {
    setupAxiosInterceptors(store, clearAuth);
  }, []);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />

        {/* Protected Admin Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer theme="dark" />
    </Router>
  );
}

export default App;
