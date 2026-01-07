import { useEffect, useState } from "react";
import { X, LogOut, Upload, Eye, EyeOff, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { toggleProfilePanel, closeAll } from "../../store/slices/popupSlice";
import {
  updateProfile,
  updatePassword,
  logout,
  getCurrentUser,
} from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

const ProfilePanel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isProfilePanelOpen } = useSelector((state) => state.popup);
  const { authUser, isUpdatingProfile, isUpdatingPassword } = useSelector(
    (state) => state.auth
  );
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    avatar: null,
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    if (authUser) {
      setProfileData({
        name: authUser.name || "",
        email: authUser.email || "",
        avatar: null,
      });
    }
  }, [authUser]);

  useEffect(() => {
    if (!isProfilePanelOpen) {
      setActiveTab("profile");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    }
  }, [isProfilePanelOpen]);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", profileData.name);
    formData.append("email", profileData.email);
    if (profileData.avatar) {
      formData.append("avatar", profileData.avatar);
    }
    dispatch(updateProfile(formData));
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }
    dispatch(
      updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmNewPassword: passwordData.confirmNewPassword,
      })
    );
  };

  const handleLogout = () => {
    dispatch(logout()).then(() => {
      dispatch(closeAll());
      navigate("/");
    });
  };

  if (!isProfilePanelOpen || !authUser) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
          <button
            onClick={() => dispatch(toggleProfilePanel())}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b">
            <button
              onClick={() => setActiveTab("profile")}
              className={`pb-2 px-4 font-semibold ${
                activeTab === "profile"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600"
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`pb-2 px-4 font-semibold ${
                activeTab === "password"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600"
              }`}
            >
              Password
            </button>
          </div>

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <img
                    src={authUser.avatar?.url || "/avatar-holder.avif"}
                    alt={authUser.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">
                    <Upload className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          avatar: e.target.files[0],
                        })
                      }
                    />
                  </label>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {authUser.name}
                  </h3>
                  <p className="text-gray-600">{authUser.email}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 text-black dark:text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 text-black dark:text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isUpdatingProfile ? "Updating..." : "Update Profile"}
              </button>
            </form>
          )}

          {/* Password Tab */}
          {activeTab === "password" && (
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 text-black dark:text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 text-black dark:text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordData.confirmNewPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmNewPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 text-black dark:text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isUpdatingPassword ? "Updating..." : "Update Password"}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;
