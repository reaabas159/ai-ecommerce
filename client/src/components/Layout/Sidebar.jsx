import {
  X,
  Home,
  Package,
  Info,
  HelpCircle,
  ShoppingCart,
  List,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar, closeAll } from "../../store/slices/popupSlice";
import { logout } from "../../store/slices/authSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { isSidebarOpen } = useSelector((state) => state.popup);
  const { authUser } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(closeAll());
  };

  if (!isSidebarOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
      <div className="bg-white w-64 h-full">
        <div className="p-4 flex items-center justify-between border-b">
          <h2 className="text-xl font-bold text-blue-600">Menu</h2>
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <Link
            to="/"
            onClick={() => dispatch(toggleSidebar())}
            className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <Home className="w-5 h-5" />
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => dispatch(toggleSidebar())}
            className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <Package className="w-5 h-5" />
            Products
          </Link>
          <Link
            to="/cart"
            onClick={() => dispatch(toggleSidebar())}
            className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <ShoppingCart className="w-5 h-5" />
            Cart
          </Link>
          {authUser && (
            <Link
              to="/orders"
              onClick={() => dispatch(toggleSidebar())}
              className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <List className="w-5 h-5" />
              Orders
            </Link>
          )}
          <Link
            to="/about"
            onClick={() => dispatch(toggleSidebar())}
            className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <Info className="w-5 h-5" />
            About
          </Link>
          <Link
            to="/faq"
            onClick={() => dispatch(toggleSidebar())}
            className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <HelpCircle className="w-5 h-5" />
            FAQ
          </Link>
          <Link
            to="/contact"
            onClick={() => dispatch(toggleSidebar())}
            className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <Phone className="w-5 h-5" />
            Contact
          </Link>

          {authUser ? (
            <div className="pt-4 border-t">
              <p className="px-3 py-2 text-sm text-gray-600">{authUser.name}</p>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-lg"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                dispatch(toggleSidebar());
                // You might want to open login modal here
              }}
              className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Login
            </button>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
