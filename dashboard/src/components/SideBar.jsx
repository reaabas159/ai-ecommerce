import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ListOrdered,
  Package,
  Users,
  User,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setOpenedComponent, toggleNavbar } from "../store/slices/extraSlice";

const SideBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { openedComponent, isNavbarOpened } = useSelector(
    (state) => state.extra
  );

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, component: "Dashboard" },
    { name: "Products", icon: Package, component: "Products" },
    { name: "Orders", icon: ListOrdered, component: "Orders" },
    { name: "Users", icon: Users, component: "Users" },
    { name: "Profile", icon: User, component: "Profile" },
  ];

  const handleMenuClick = (component) => {
    dispatch(setOpenedComponent(component));
    if (isNavbarOpened) {
      dispatch(toggleNavbar());
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isNavbarOpened && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => dispatch(toggleNavbar())}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white shadow-lg z-50 transition-transform duration-300 ${
          isNavbarOpened ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:z-auto w-64`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold text-blue-600">Menu</h2>
          <button
            onClick={() => dispatch(toggleNavbar())}
            className="md:hidden text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.component}
                onClick={() => handleMenuClick(item.component)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  openedComponent === item.component
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default SideBar;
