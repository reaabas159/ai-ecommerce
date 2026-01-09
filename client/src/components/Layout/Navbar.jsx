import { Link, useNavigate } from "react-router-dom";
import { Menu, User, ShoppingCart, Sun, Moon, Search } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { toggleAuthPopup } from "../../store/slices/popupSlice";
import { toggleSidebar } from "../../store/slices/popupSlice";
import { toggleSearchBar } from "../../store/slices/popupSlice";
import { toggleCart } from "../../store/slices/popupSlice";
import { toggleProfilePanel } from "../../store/slices/popupSlice";
import { logout } from "../../store/slices/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { authUser } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    dispatch(logout()).then(() => {
      navigate("/");
    });
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            AIECOMM
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600"
            >
              Products
            </Link>
            <Link
              to="/about"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600"
            >
              Contact
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => dispatch(toggleSearchBar())}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={() => dispatch(toggleCart())}
              className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {authUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => dispatch(toggleProfilePanel())}
                  className="flex items-center gap-2 px-2 sm:px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline">{authUser.name}</span>
                </button>
                <Link
                  to="/orders"
                  className="hidden md:inline-flex px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600"
                >
                  Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden md:inline-flex px-4 py-2 text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => dispatch(toggleAuthPopup())}
                className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Login
              </button>
            )}

            <button
              onClick={() => dispatch(toggleSidebar())}
              className="md:hidden p-2 text-gray-700 dark:text-gray-300"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
